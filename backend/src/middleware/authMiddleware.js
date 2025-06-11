import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("AUTH MIDDLEWARE DEBUG");
  console.log("All cookies:", req.cookies);
  console.log("Authorization header:", req.headers.authorization);
  
  // Try to get token from cookies first, then from Authorization header
  let token = req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
      console.log("Token found in Authorization header");
    }
  } else {
    console.log("Token found in cookies");
  }
  
  if (!token) {
    console.log("NO TOKEN FOUND ANYWHERE");
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("TOKEN VALID, User:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;