import mongoose, { Document, Schema } from "mongoose";

export interface IDomain extends Document {
  domainName: string;
  virusTotalInfo?: object;
  whoisInfo?: object;
}

const domainSchema: Schema = new Schema({
  domainName: { type: String, required: true },
  virusTotalInfo: { type: Object, required: false },
  whoisInfo: { type: Object, required: false },
});

export default mongoose.model<IDomain>("Domain", domainSchema);
