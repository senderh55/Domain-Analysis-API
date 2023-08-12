const express = require("express");
const domainRouter = require("./routes/domainRoute");
const {
  startDomainAnalysisScheduler,
} = require("./services/schedulingService");

import helmet from "helmet";
import { logRequestMiddleware } from "./middlewares/requestLogMiddleware";

require("./services/databaseService"); // Database connection

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet()); // Helmet for security
app.use(domainRouter);
app.use(logRequestMiddleware);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

startDomainAnalysisScheduler(); // Start scheduler for domain analysis
