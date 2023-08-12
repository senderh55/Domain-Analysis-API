import express from "express";
import {
  domainValidationRules,
  validateDomain,
} from "../middlewares/domainValidationMiddleware";
const router = express.Router();
import * as domainController from "../controllers/domainController";
import { logRequest } from "../middlewares/loggingMiddleware"; // Import the middleware
router.use(logRequest);

// FIXME: add auth middlewares to routes
router.get("/domainAnalysis/:domainName", domainController.getDomainInfo);
router.post("/domainAnalysis", domainController.addDomainForAnalysis);

module.exports = router;
