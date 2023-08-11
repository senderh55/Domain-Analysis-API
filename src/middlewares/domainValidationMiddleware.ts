import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
const DomainModel = require("../models/DomainModel");

export const domainValidationRules = [
  body("domain")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Domain must be a valid string")
    .custom(async (value) => {
      const existingDomain = await DomainModel.findOne({ name: value });
      if (existingDomain) {
        throw new Error("Domain already exists");
      }
    }),
];

// checks the validation results for errors and returns them if any are found
export const validateDomain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
