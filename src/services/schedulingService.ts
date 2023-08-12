import { sendDomainsForAnalysis } from "../utils/rabbitmq";
import Domain from "../models/DomainModel";

const schedule = require("node-schedule");

export const startDomainAnalysisScheduler = async () => {
  const analysisInterval = process.env.ANALYSIS_INTERVAL || "0 0 1 * *";
  schedule.scheduleJob(analysisInterval, async () => {
    try {
      const domains = await Domain.find({});
      const domainNames = domains.map((domain) => domain.domainName);
      await sendDomainsForAnalysis(domainNames);
    } catch (error) {
      console.error(error);
    }
  });
};
