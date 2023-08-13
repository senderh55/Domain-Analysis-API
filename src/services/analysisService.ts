import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* APIs are interacted with and data is returned, each API has its own function.
 To return the data, we use promise.all to wait for all APIs to complete
 A failed API will return null and won't shut down the system if it returned null*/
interface DomainAnalysis {
  virusTotalInfo: object | null;
  whoisInfo: object | null;
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
    return response.data.WhoisRecord;
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
