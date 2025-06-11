
import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
      const { success } = await ratelimit.limit("my-rate-limit");
  
      if (!success) {
        console.log("🚫 Rate limit triggered for request:", req.originalUrl);
        return res.status(429).json({ message: "Too many requests" });
      }
  
      next();
    } catch (error) {
      console.log("Rate limit error", error);
      next(error);
    }
  };
  

export default rateLimiter;