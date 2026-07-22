import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    urgency: { type: String, enum: ["low", "medium", "critical"], default: "medium" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    status: { type: String, enum: ["open", "fulfilled"], default: "open" },
  },
  { timestamps: true }
);

requestSchema.index({ location: "2dsphere" });

const Request = mongoose.model("Request", requestSchema);
export default Request;