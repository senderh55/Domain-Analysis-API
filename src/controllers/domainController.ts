import { Request, Response } from "express";
import { analyzeDomain } from "../services/analysisService";
import Domain, { IDomain } from "../models/DomainModel";

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
    const newDomain = new Domain({ domainName, ...analysis }); // Make sure to include all required fields here
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
  if (!domainName) {
    return res.status(400).send("Domain name is required");
  }
  try {
    const existingDomain = await Domain.findOne({ domainName });
    if (existingDomain) {
      return res.json({
        message: "Domain already exists",
      });
    }
    const analysis = await analyzeDomain(domainName);
    const newDomain = new Domain({ domainName, ...analysis });
    await newDomain.save();
    res.json({ message: "Domain added for analysis." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to process the request");
  }
};

export const getDomainInfo = async (req: Request, res: Response) => {
  const { domainName } = req.params;
  const domainInfo = await Domain.findOne({ domainName });
  if (!domainInfo) {
    await createNewDomainAndSendResponse(domainName, res);
    return;
  }
  if (requiresUpdate(domainInfo)) {
    await updateDomainAndSendResponse(domainName, res);
    return;
  }
  res.json(domainInfo);
};
