import mongoose, { Document, Schema } from "mongoose";

export interface IDomain extends Document {
  domainName: string;
  virusTotalInfo?: object;
  whoisInfo?: object;
  status: string; // 'pending' or 'completed'
}

const domainSchema: Schema = new Schema({
  domainName: { type: String, required: true },
  virusTotalInfo: { type: Object, required: false },
  whoisInfo: { type: Object, required: false },
  status: { type: String, default: "completed" },
});

export default mongoose.model<IDomain>("Domain", domainSchema);
