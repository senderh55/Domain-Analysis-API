import { Request, Response, NextFunction } from "express";
import RequestLog from "../models/RequestLogModel";
export const logRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestLogData = {
    endpoint: req.originalUrl,
    method: req.method,
    parameters: req.params,
    requestBody: req.body,
  };

  const requestLog = new RequestLog(requestLogData);

  requestLog
    .save()
    .catch((error) => console.error("Error saving request log:", error));

  next();
};
