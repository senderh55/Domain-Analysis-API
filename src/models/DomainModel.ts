import mongoose, { Document, Schema } from "mongoose";

export interface IDomain extends Document {
  name: string;
  virusTotalInfo?: object;
  whoisInfo?: object;
}

const domainSchema: Schema = new Schema({
  name: { type: String, required: true },
  virusTotalInfo: { type: Object, required: false },
  whoisInfo: { type: Object, required: false },
});

export default mongoose.model<IDomain>("Domain", domainSchema);
