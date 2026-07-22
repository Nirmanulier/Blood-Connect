export const urgentAlertTemplate = (donorName, bloodGroup, bankName, address) => `
  <div style="font-family: sans-serif; padding: 20px;">
    <h2 style="color: #d32f2f;">Urgent Blood Requirement</h2>
    <p>Hi ${donorName},</p>
    <p><strong>${bankName}</strong> urgently needs <strong>${bloodGroup}</strong> blood donors.</p>
    <p>Location: ${address}</p>
    <p>If you're eligible and available, please reach out or visit the nearest camp/bank.</p>
    <p style="color: #888; font-size: 12px;">You're receiving this because your registered blood group matches this request.</p>
  </div>
`;