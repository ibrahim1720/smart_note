import { Router } from 'express';
import {addNote, deleteNote, summarizeNote} from "../controller/notesController.js";
import {extractFromToken} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";
import {addNoteSchema} from "../validators/notes.js";
import {errorHandler} from "../middleware/errorhandlerMiddleware.js";

const router = Router();

router.post('/notes', errorHandler(extractFromToken),validationMiddleware(addNoteSchema), errorHandler(addNote));
router.delete('/notes/:id',errorHandler(extractFromToken), errorHandler(deleteNote));
router.post('/notes/:id/summarize',errorHandler(extractFromToken), errorHandler(summarizeNote));

export default router;