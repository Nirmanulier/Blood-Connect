import User from "../models/user.model.js";
import BloodBank from "../models/bloodbank.model.js";
import { resend, EMAIL_FROM } from "../lib/resend.js";
import { urgentAlertTemplate } from "../emails/urgentAlert.js";

export const broadcastUrgentNeed = async (req, res) => {
  const { bloodGroup, maxDistance = 15000, address } = req.body;

  try {
    const bank = await BloodBank.findById(req.userId);
    if (!bank) return res.status(404).json({ message: "Bank not found" });

    const matchingDonors = await User.find({
      bloodGroup,
      isEligible: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: bank.location.coordinates },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    if (matchingDonors.length === 0) {
      return res.status(200).json({ message: "No matching donors nearby", notified: 0 });
    }

    // send emails — batched with Promise.allSettled so one failure doesn't block others
    const results = await Promise.allSettled(
      matchingDonors.map((donor) =>
        resend.emails.send({
          from: EMAIL_FROM,
          to: donor.email,
          subject: `Urgent: ${bloodGroup} blood needed near you`,
          html: urgentAlertTemplate(donor.name, bloodGroup, bank.name, address || "Not specified"),
        })
      )
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    res.status(200).json({
      message: "Broadcast sent",
      notified: successCount,
      totalMatched: matchingDonors.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};