const dotenv = require("dotenv");
const mongoose = require("mongoose");
import RequestLogModel from "../models/RequestLogModel"; // Adjust path to your Request Log model

dotenv.config();
mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database!");
});

export default { db };

export const logRequest = async (request: object) => {
  const requestLog = new RequestLogModel(request);
  await requestLog.save();
};
