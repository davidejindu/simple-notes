
import jwt from "jsonwebtoken"; 

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.log("JWT Error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
