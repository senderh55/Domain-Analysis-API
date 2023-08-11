import { Request, Response } from "express";
const Domain = require("../models/DomainModel");

exports.getDomainInfo = async (req: Request, res: Response) => {
  const domainName = req.params.name;
  const domain = await Domain.findOne({ name: domainName });
  if (domain) {
    res.json(domain);
  } else {
    const newDomain = new Domain({ name: domainName });
    await newDomain.save();
    res.json({ message: "Domain added for analysis. Check back later." });
  }
};

exports.addDomainForAnalysis = async (req: Request, res: Response) => {
  const domainName = req.body.domain;
  const existingDomain = await Domain.findOne({ name: domainName });
  if (existingDomain) {
    res.json({
      message: "Domain already exists or is currently being scanned.",
    });
  } else {
    const newDomain = new Domain({ name: domainName });
    await newDomain.save();
    res.json({ message: "Domain added for analysis." });
  }
};
