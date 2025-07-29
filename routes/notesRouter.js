import { Router } from 'express';
import {addNote, deleteNote, summarizeNote} from "../controller/notesController.js";
import {extractFromToken} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";
import {addNoteSchema} from "../validators/notes.js";

const router = Router();

router.post('/notes', extractFromToken,validationMiddleware(addNoteSchema), addNote);
router.delete('/notes/:id',extractFromToken, deleteNote);
router.post('/notes/:id/summarize',extractFromToken, summarizeNote);

export default router;