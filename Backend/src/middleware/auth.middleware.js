import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};

export const requireBank = (req, res, next) => {
  if (req.role !== "bank") return res.status(403).json({ message: "Bank access only" });
  next();
};