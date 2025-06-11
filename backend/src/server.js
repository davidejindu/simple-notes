import { connectDB } from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/usersRoutes.js"; 
import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import geminiRoutes from "./routes/geminiRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors({
  origin: "https://simple-notes-two-nu.vercel.app",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// Routes
app.use("/api/gemini", geminiRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", userRoutes); 


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
