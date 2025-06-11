import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE DEBUG ===");
  console.log("All cookies:", req.cookies);
  console.log("Token cookie:", req.cookies.token);
  
  const token = req.cookies.token;
  
  if (!token) {
    console.log("❌ NO TOKEN FOUND");
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ TOKEN VALID, User:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;