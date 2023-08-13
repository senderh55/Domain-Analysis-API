const express = require("express");
const domainRouter = require("./routes/domainRoute");
const cors = require("cors");
import { startConsumer } from "./controllers/domainController";

const {
  startDomainAnalysisScheduler,
} = require("./services/schedulingService");

import helmet from "helmet";
import { limiter } from "./middlewares/rateLimitMiddleware";
import { logRequest } from "./middlewares/loggingMiddleware";

require("./services/databaseService"); // Database connection

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(helmet()); // Helmet for security
app.use(domainRouter);
app.use(limiter);
app.use(logRequest);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Start the consumer
startConsumer();

// Start the scheduler
startDomainAnalysisScheduler();
