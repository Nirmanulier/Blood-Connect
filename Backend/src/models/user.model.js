import mongoose from "mongoose";

import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    lastDonationDate: { type: Date, default: null },
    isEligible: { type: Boolean, default: true },
    role: { type: String, default: "donor" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

userSchema.methods.checkEligibility = function () {
  if (!this.lastDonationDate) return true;
  const daysSince = (Date.now() - this.lastDonationDate) / (1000 * 60 * 60 * 24);
  return daysSince >= 90;
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ location: "2dsphere" }); // enables geo queries

const User = mongoose.model("User", userSchema);
export default User;