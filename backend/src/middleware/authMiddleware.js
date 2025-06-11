const authMiddleware = (req, res, next) => {
  // Try to get token from cookies first, then from Authorization header
  let token = req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }
  
  console.log("Token found:", !!token);
  
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