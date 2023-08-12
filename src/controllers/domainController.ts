import { Request, Response } from "express";
import { analyzeDomain } from "../services/analysisService";
import Domain, { IDomain } from "../models/DomainModel";
import { connectToRabbitMQ } from "../utils/rabbitmq";

const getKeysToIterate = (): (keyof IDomain)[] => {
  const domainKeys = Object.keys(Domain.schema.paths) as (keyof IDomain)[];
  const keysToExclude = ["domain", "_id", "__v"];
  return domainKeys.filter((key) => !keysToExclude.includes(key));
};

const requiresUpdate = (domain: IDomain): boolean => {
  const keysToIterate = getKeysToIterate();
  return keysToIterate.some((key) => domain[key] === null);
};

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

async function createNewDomainAndSendResponse(
  domainName: string,
  res: Response
): Promise<void> {
  try {
    const analysis = await analyzeDomain(domainName);
    const newDomain = new Domain({ domainName, ...analysis });
    await newDomain.save();
    res
      .status(202)
      .json({ message: "Domain added for analysis. Check back later." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to analyze domain");
  }
}

export const addDomainForAnalysis = async (req: Request, res: Response) => {
  const { domainName } = req.body;
  const validatedDomainName = domainName.replace(/^(https?:\/\/)?(www\.)?/, "");
  try {
    const domainInfo = await Domain.findOne({
      domainName: validatedDomainName,
    });
    if (domainInfo) {
      if (domainInfo.status === "pending") {
        res.status(202).json({
          message: "Analysis is currently being scanned. Check back later.",
        });
        return;
      }
      return res.json({
        message: "Domain already exists",
      });
    }
    const analysis = await analyzeDomain(validatedDomainName);
    const newDomain = new Domain({ validatedDomainName, ...analysis });
    await newDomain.save();
    res.json({ message: "Domain added for analysis." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to process the request");
  }
};

export const getDomainInfo = async (req: Request, res: Response) => {
  const { domainName } = req.params;
  const validatedDomainName = domainName.replace(/^(https?:\/\/)?(www\.)?/, "");
  const domainInfo = await Domain.findOne({ domainName: validatedDomainName });
  if (!domainInfo) {
    await createNewDomainAndSendResponse(validatedDomainName, res);
    return;
  }
  if (domainInfo.status === "pending") {
    res.status(202).json({
      message: "Analysis is currently being scanned. Check back later.",
    });
    return;
  }
  if (requiresUpdate(domainInfo)) {
    await updateDomainAndSendResponse(validatedDomainName, res);
    return;
  }
  res.json(domainInfo);
};

export const startConsumer = async () => {
  const channel = await connectToRabbitMQ();
  await channel.assertQueue("domain-analysis");
  console.log("Consumer started");
  channel.consume(
    "domain-analysis",
    async (msg: { content: { toString: () => string } }) => {
      if (msg) {
        const { domainName } = JSON.parse(msg.content.toString());
        await Domain.updateOne({ domainName }, { status: "pending" }); // Set status as 'pending'
        const analysis = await analyzeDomain(domainName);
        await Domain.updateOne(
          { domainName },
          { ...analysis, status: "completed" }
        ); // Update status back to 'completed'
        channel.ack(msg);
      }
    }
  );
};
