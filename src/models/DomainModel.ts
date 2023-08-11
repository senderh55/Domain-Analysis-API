import mongoose from "mongoose";
const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  virusTotalInfo: { type: Object, required: false },
  whoisInfo: { type: Object, required: false },
});

module.exports = mongoose.model("Domain", domainSchema);
