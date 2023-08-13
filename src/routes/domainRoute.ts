import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Domain Analysis
 *   description: API endpoints for domain analysis
 */

import { validateDomainParam } from "../middlewares/validateDomainParamMiddlewere";
import { validateDomainBody } from "../middlewares/validateDomainBodyMiddlewere";
import { websiteStatusMiddleware } from "../middlewares/websiteStatusMiddleware";
import * as domainController from "../controllers/domainController";

/**
 * @swagger
 * /domainAnalysis/{domainName}:
 *   get:
 *     summary: Get domain information
 *     tags: [Domain Analysis]
 *     parameters:
 *       - in: path
 *         name: domainName
 *         required: true
 *         schema:
 *           type: string
 *         description: The domain name to analyze
 *     responses:
 *       200:
 *         description: Domain information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainInfo'
 *       202:
 *         description: Analysis is currently being scanned. Check back later.
 *       500:
 *         description: Failed to process the request
 */
router.get(
  "/domainAnalysis/:domainName",
  validateDomainParam,
  websiteStatusMiddleware,
  domainController.getDomainInfo
);

/**
 * @swagger
 * /domainAnalysis:
 *   post:
 *     summary: Add domain for analysis
 *     tags: [Domain Analysis]
 *     requestBody:
 *       description: Domain details to analyze
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DomainRequestBody'
 *     responses:
 *       200:
 *         description: Domain added for analysis. Check back later.
 *       202:
 *         description: Analysis is currently being scanned. Check back later.
 *       500:
 *         description: Failed to process the request
 */
router.post(
  "/domainAnalysis",
  validateDomainBody,
  websiteStatusMiddleware,
  domainController.addDomainForAnalysis
);

module.exports = router;
