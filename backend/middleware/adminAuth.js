// Simple admin auth middleware using env credentials
// In production replace with JWT — this is sufficient for a single-admin app

module.exports = function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"];
  const expected = Buffer.from(
    `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}`
  ).toString("base64");

  if (!token || token !== expected) {
    return res.status(401).json({ message: "Unauthorized: Admin access required." });
  }
  next();
};
