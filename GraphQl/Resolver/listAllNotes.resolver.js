import { Note } from "../../models/noteModel.js";
import { validate } from "../Middlewares/index.js";
import { paginationNoteSchema } from "../validators/note.validator.js";

/**
 * @param {object} args
 * @param {object} parent
 * @returns return response [{note}]
 * @description apply authentication middleware to check if the user is authenticated
 * @description validate the encoming args
 * @description get all notes with paginated and filtered
 */
export const getAllNotes = async (parent, args) => {
  //validate the encoming args
  const valid = await validate(paginationNoteSchema, args);
  if (valid !== true) {
    throw new Error(valid.map((error) => error.message).join(", "));
  }

  const { page = 1, limit = 10 } = args;
  const skip = (page - 1) * limit;

  //filter object
  var filter = {};
  if (args.title) {
    filter.title = { $regex: args.title, $options: "i" };
  }
  if (args.content) {
    filter.content = { $regex: args.content, $options: "i" }; // case-insensitive search
  }
  if(args.ownerId){
    filter.ownerId = args.ownerId;
  }

  const notes = await Note.find(filter)
    .limit(limit)
    .skip(skip)
    .populate("ownerId");

  return notes;
};
