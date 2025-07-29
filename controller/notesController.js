import {Note} from "../models/noteModel.js";
import {GoogleGenAI} from '@google/genai';
import {ErrorClass} from "../errorClass.js";


export const deleteNote = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorClass(400, 'Note ID is required', "deleteNote"));
    }
    const note = await Note.findOneAndDelete({ _id: id, ownerId: req.userId });
    if (!note) {
        return next(new ErrorClass(404, `Note with id ${id} not found`, "deleteNote"));
    }
    res.status(200).send(`Note with id ${id} deleted successfully`);
}

export const addNote = async (req, res, next) => {
    const { title, content, ownerId } = req.body;

    if(req.userId !== ownerId) {
        return next(new ErrorClass(403, 'You are not authorized to add this note', "addNote"))
    }

    const newNote = new Note({ title, content, ownerId });
    await newNote.save();
    await newNote.populate('ownerId', 'email');
    res.status(201).send(newNote);
}

export const summarizeNote = async (req, res, next) => {
    const {id} = req.params;
    if (!id) {
        return next(new ErrorClass(400, 'Note ID is required', "summarizeNote"));
    }
    const note = await Note.findOne({ _id: id, ownerId: req.userId });

    if (!note) {
        return next(new ErrorClass(404, `Note with id ${id} not found`, "summarizeNote"));
    }
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: 'summarize the following note content: ' + note.content,
        config: {
            systemInstruction: [
                'You are a helpful assistant that summarizes notes.' +
                'give me only the summary of the note content without any additional information.',
            ],
        },
    });
    const summary = response.text;
    await Note.findOneAndUpdate(
        { _id: id, ownerId: req.userId },
        { $set: { summary } },
        { new: true }
    );
    res.status(200).json({ summary });
}