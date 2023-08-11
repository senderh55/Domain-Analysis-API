const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database!");
});

export default { db };
