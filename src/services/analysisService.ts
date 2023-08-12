import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface DomainAnalysis {
  virusTotalInfo: object | null;
  whoisInfo: object | null;
  additionalInfo?: object;
}

const fetchVirusTotalInfo = async (domain: string): Promise<object> => {
  const url = `https://www.virustotal.com/api/v3/domains/${domain}`;
  const headers = {
    "x-apikey": process.env.VIRUS_TOTAL_API_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch VirusTotal info");
  }
};

const fetchWhoisInfo = async (domain: string): Promise<object> => {
  const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env.WHOIS_XML_API_KEY}&domainName=${domain}&outputFormat=json`;

  try {
    const response = await axios.get(url);
    console.log(response);
    return response.data.WhoisRecord; // The structure might already match the WhoisInfo interface
  } catch (error) {
    throw new Error("Failed to fetch Whois info");
  }
};

export const analyzeDomain = async (
  domain: string
): Promise<DomainAnalysis> => {
  try {
    const virusTotalPromise = fetchVirusTotalInfo(domain);
    const whoisPromise = fetchWhoisInfo(domain);

    const virusTotalInfoPromise = virusTotalPromise.catch((error) => {
      console.error("Error fetching VirusTotal info:", error.message);
      return null;
    });

    const whoisInfoPromise = whoisPromise.catch((error) => {
      console.error("Error fetching Whois info:", error.message);
      return null;
    });

    const [virusTotalInfo, whoisInfo] = await Promise.all([
      virusTotalInfoPromise,
      whoisInfoPromise,
    ]);

    const analysis: DomainAnalysis = {
      virusTotalInfo,
      whoisInfo,
    };

    return analysis;
  } catch (error) {
    throw new Error("Failed to analyze all domain api's");
  }
};
