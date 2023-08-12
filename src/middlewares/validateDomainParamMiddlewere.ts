import { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";

export const validateDomainParam = [
  param("domainName").custom((value) => {
    const domain = value.replace(/^(https?:\/\/)?(www\.)?/, "");
    // Validate that it's in the format domain.com or subdomain.domain.com
    if (!/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(domain)) {
      throw new Error("Invalid domain name parameter");
    }
    return domain;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
