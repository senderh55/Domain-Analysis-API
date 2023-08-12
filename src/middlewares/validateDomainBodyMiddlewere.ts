import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateDomainBody = [
  body("domainName").custom((value, { req }) => {
    // Remove http https www. if present
    const domain = value.replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(domain)) {
      throw new Error("Invalid domain name parameter");
    }
    req.validatedDomain = domain;
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
