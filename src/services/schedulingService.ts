import { sendDomainsForAnalysis } from "../rabbitmq/rabbitmq";
import Domain from "../models/DomainModel";

const schedule = require("node-schedule");
/**The system will scan the domains in the database at a given interval and gather information about
them using RabbitMQ, the defualt interval in every one month**/
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
