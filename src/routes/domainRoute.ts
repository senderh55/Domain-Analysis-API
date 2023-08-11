import express from "express";
import {
  domainValidationRules,
  validateDomain,
} from "../middlewares/domainValidation";
const router = express.Router();
const domainController = require("../controllers/domainController");

router.get("/domain/:name", domainController.getDomainInfo);
router.post(
  "/domain",
  domainValidationRules,
  validateDomain,
  domainController.addDomainForAnalysis
);

module.exports = router;
