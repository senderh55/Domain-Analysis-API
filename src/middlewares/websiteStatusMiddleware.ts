import { Request, Response, NextFunction } from "express";
import axios from "axios";

declare global {
  namespace Express {
    interface Request {
      websiteStatus?: boolean;
    }
  }
}

export async function websiteStatusMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const url: string =
    (req.body.domainName as string) || (req.params.domainName as string);
  try {
    // add "http" to the url if it doesn't exist
    let urlToCheck = url;
    if (!url.includes("http")) {
      urlToCheck = "http://" + url;
    }
    const response = await axios.get(urlToCheck);
    console.log(response.status);
    if (response.status !== 200) throw new Error();
  } catch (error) {
    return res.status(404).json({ message: "Website not found" });
  }

  next();
}
