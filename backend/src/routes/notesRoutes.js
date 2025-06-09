import express from "express";
import {
  deleteNote,
  getAllNotes,
  updateNote,
  createNote,
  getNoteById,
} from "../controllers/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); 

router.get("/", getAllNotes);
router.post("/", createNote);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;