import express from "express";
import {
  domainValidationRules,
  validateDomain,
} from "../middlewares/domainValidationMiddleware";
const router = express.Router();
import * as domainController from "../controllers/domainController";

// FIXME: add auth middlewares to routes
router.get("/domainAnalysis/:name", domainController.getDomainInfo);
router.post("/domainAnalysis", domainController.addDomainForAnalysis);

module.exports = router;
