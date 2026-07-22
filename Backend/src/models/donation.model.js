import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodBank: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },
    date: { type: Date, default: Date.now },
    units: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;