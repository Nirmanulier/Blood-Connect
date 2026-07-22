import mongoose from "mongoose";

const campSchema = new mongoose.Schema(
  {
    organizedBy: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },
    title: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    address: { type: String, required: true }, // human-readable, for display
    date: { type: Date, required: true },
    neededGroups: [{ type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }],
  },
  { timestamps: true }
);

campSchema.index({ location: "2dsphere" });

const Camp = mongoose.model("Camp", campSchema);
export default Camp;