import { Request, Response } from "express";
import { analyzeDomain } from "../services/analysisService";
import Domain, { IDomain } from "../models/DomainModel";
import { connectToRabbitMQ } from "../rabbitmq/rabbitmq";

/**
 * Retrieves the keys from the Domain schema for iteration,
 * excluding specific keys.
 * @returns An array of keys to iterate over for domain analysis.
 */
const getKeysToIterate = (): (keyof IDomain)[] => {
  const domainKeys = Object.keys(Domain.schema.paths) as (keyof IDomain)[];
  const keysToExclude = ["domainName", "_id", "__v"];
  return domainKeys.filter((key) => !keysToExclude.includes(key));
};

/**
 * Checks if a domain object requires an update by iterating over keys
 * and checking for null values.
 * @param domain - The domain object to be checked for updates.
 * @returns True if an update is required, otherwise false.
 */
const requiresUpdate = (domain: IDomain): boolean => {
  const keysToIterate = getKeysToIterate();
  return keysToIterate.some((key) => domain[key] === null);
};
/**
 *
 * Updates the domain analysis and sends a response to the client.
 * @param domainName - The domain name being analyzed.
 * @param res - The Express response object.
 */
async function updateDomainAndSendResponse(
  domainName: string,
  res: Response
): Promise<void> {
  try {
    const updatedAnalysis = await analyzeDomain(domainName);
    res.status(202).json({
      message:
        "Domain exists, but part of the analysis was missing and is currently being updated. Check back later.",
    });
    await Domain.updateOne({ domainName }, { ...updatedAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to analyze domain");
  }
}

/**
 * Creates a new domain entry, performs analysis, and sends a response to the client.
 * @param domainName - The domain name to be added for analysis.
 * @param res - The Express response object.
 */
async function createNewDomainAndSendResponse(
  domainName: string,
  res: Response
): Promise<void> {
  try {
    const analysis = await analyzeDomain(domainName);
    const newDomain = new Domain({ domainName, ...analysis });
    await newDomain.save();
    res
      .status(200)
      .json({ message: "Domain added for analysis. Check back later." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to analyze domain");
  }
}

/**
 * Checks if a domain is currently being scanned by the schedulingService
 * and sends an appropriate response to the client.
 * @param domainInfo - The domain information object retrieved from the database.
 * @param res - The Express response object.
 */
const checkIfCurrentlyBeingScanned = (
  domainInfo: { status: string },
  res: Response
) => {
  if (domainInfo.status === "pending") {
    return res.status(202).json({
      message: "Analysis is currently being scanned. Check back later.",
    });
  }
};

/**
 * Adds a domain for analysis or returns existing analysis information.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const addDomainForAnalysis = async (req: Request, res: Response) => {
  const { domainName } = req.body;
  const validatedDomainName = domainName.replace(/^(https?:\/\/)?(www\.)?/, "");
  try {
    // Check if domain already exists
    const domainInfo = await Domain.findOne({
      domainName: validatedDomainName,
    });
    if (domainInfo) {
      checkIfCurrentlyBeingScanned(domainInfo, res);
      return res.json({
        message: "Domain already exists",
      });
    }
    // New domain - add domain for analysis
    await createNewDomainAndSendResponse(validatedDomainName, res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to process the request");
  }
};

/**
 * Retrieves domain information or triggers analysis if necessary.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getDomainInfo = async (req: Request, res: Response) => {
  const { domainName } = req.params;
  const validatedDomainName = domainName.replace(/^(https?:\/\/)?(www\.)?/, "");
  const domainInfo = await Domain.findOne({ domainName: validatedDomainName });
  if (!domainInfo) {
    await createNewDomainAndSendResponse(validatedDomainName, res);
    return;
  }
  checkIfCurrentlyBeingScanned(domainInfo, res);
  if (requiresUpdate(domainInfo)) {
    await updateDomainAndSendResponse(validatedDomainName, res);
    return;
  }
  res.json(domainInfo);
};

/**
 * Starts a RabbitMQ consumer to process domain analysis messages.
 */
export const startConsumer = async () => {
  const channel = await connectToRabbitMQ();
  await channel.assertQueue("domain-analysis");
  console.log("Consumer started");
  channel.consume(
    "domain-analysis",
    async (msg: { content: { toString: () => string } }) => {
      if (msg) {
        const { domainName } = JSON.parse(msg.content.toString());
        console.log(domainName + " is being scanned and analyzed");
        // Set status as 'pending' while analysis is being scanned
        await Domain.updateOne({ domainName }, { status: "pending" });
        const analysis = await analyzeDomain(domainName);
        await Domain.updateOne(
          { domainName },
          { ...analysis, status: "completed" }
        );
        channel.ack(msg);
      }
    }
  );
};
