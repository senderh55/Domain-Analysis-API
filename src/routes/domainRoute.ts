import express from "express";
import { validateDomainParam } from "../middlewares/validateDomainParamMiddlewere";
import { validateDomainBody } from "../middlewares/validateDomainBodyMiddlewere";
import { websiteStatusMiddleware } from "../middlewares/websiteStatusMiddleware";
const router = express.Router();
import * as domainController from "../controllers/domainController";
router.get(
  "/domainAnalysis/:domainName",
  validateDomainParam,
  websiteStatusMiddleware,
  domainController.getDomainInfo
);
router.post(
  "/domainAnalysis",
  validateDomainBody,
  websiteStatusMiddleware,
  domainController.addDomainForAnalysis
);

module.exports = router;
