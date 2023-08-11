import axios from "axios";
const dotenv = require("dotenv");
dotenv.config();

interface DomainAnalysis {
  virusTotalInfo: object;
  whoisInfo: object;
  additionalInfo?: object;
}

const fetchVirusTotalInfo = async (domain: string): Promise<object> => {
  const url = `https://www.virustotal.com/api/v3/domains/${domain}`;
  const headers = {
    "x-apikey": process.env.VIRUS_TOTAL_API_KEY,
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch VirusTotal info");
  }
};

const fetchWhoisInfo = async (domain: string): Promise<object> => {
  const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env.WHOIS_API_KEY}&domainName=${domain}&outputFormat=json`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Whois info");
  }
};

export const analyzeDomain = async (
  domain: string
): Promise<DomainAnalysis> => {
  try {
    const virusTotalInfo = await fetchVirusTotalInfo(domain);
    const whoisInfo = await fetchWhoisInfo(domain);
    const analysis: DomainAnalysis = {
      virusTotalInfo,
      whoisInfo,
    };

    return analysis;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to analyze domain");
  }
};
