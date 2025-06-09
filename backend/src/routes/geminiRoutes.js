import express from "express";
import { generateNote } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/generate", generateNote);

export default router;
