import express from "express";
import { validateDomainParam } from "../middlewares/validateDomainParamMiddlewere";
import { validateDomainBody } from "../middlewares/validateDomainBodyMiddlewere";

const router = express.Router();
import * as domainController from "../controllers/domainController";

router.get(
  "/domainAnalysis/:domainName",
  validateDomainParam,
  domainController.getDomainInfo
);
router.post(
  "/domainAnalysis",
  validateDomainBody,
  domainController.addDomainForAnalysis
);

module.exports = router;
