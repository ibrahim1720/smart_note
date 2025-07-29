import {Note} from "../models/noteModel.js";
import {GoogleGenAI} from '@google/genai';


export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('Note ID is required');
        }

        const note = await Note.findOneAndDelete({ _id: id, ownerId: req.userId });
        if (!note) {
            return res.status(404).send(`Note with id ${id} not found`);
        }
        res.status(200).send(`Note with id ${id} deleted successfully`);
    }catch (e) {
        res.status(500).send('Error deleting note');
    }
}

export const addNote = async (req, res) => {
    try {
        const { title, content, ownerId } = req.body;

        if(req.userId !== ownerId) {
            return res.status(403).send('You are not authorized to add this note');
        }

        const newNote = new Note({ title, content, ownerId });
        await newNote.save();
        await newNote.populate('ownerId', 'email');
        res.status(201).send(newNote);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export const summarizeNote = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).send('Note ID is required');
        }
        const note = await Note.findOne({ _id: id, ownerId: req.userId });

        if (!note) {
            return res.status(404).send(`Note with id ${id} not found`);
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
    }catch (e) {
        res.status(500).send('Error summarizing note please try again later');
    }
}