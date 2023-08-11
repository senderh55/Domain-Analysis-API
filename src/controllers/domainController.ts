import { Request, Response } from "express";
import { analyzeDomain } from "../services/analysisService";
import Domain from "../models/DomainModel";

export const getDomainInfo = async (req: Request, res: Response) => {
  const domainName = req.params.name;
  const domain = await Domain.findOne({ name: domainName });
  if (domain) {
    res.json(domain);
  } else {
    try {
      const analysis = await analyzeDomain(domainName);
      const newDomain = new Domain({ name: domainName, ...analysis });
      await newDomain.save();
      res.json({ message: "Domain added for analysis. Check back later." });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to analyze domain");
    }
  }
};

export const addDomainForAnalysis = async (req: Request, res: Response) => {
  const domainName = req.body.domain;
  const existingDomain = await Domain.findOne({ name: domainName });
  if (existingDomain) {
    res.json({
      message: "Domain already exists or is currently being scanned.",
    });
  } else {
    try {
      const analysis = await analyzeDomain(domainName);
      const newDomain = new Domain({ name: domainName, ...analysis });
      await newDomain.save();
      res.json({ message: "Domain added for analysis." });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to analyze domain");
    }
  }
};
