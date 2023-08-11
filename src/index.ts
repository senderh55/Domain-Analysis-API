const express = require("express");
const domainRouter = require("./routes/domainRoute");
import helmet from "helmet";

require("./services/databaseService"); // Database connection

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet()); // Helmet for security
app.use("/api", domainRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
