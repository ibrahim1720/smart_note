import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
} from "graphql";
import {  NoteArgs, NoteType} from "../Types/index.js";
import { getAllNotes } from "../Resolver/index.js";
export const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    description: "this is root query",
    fields: {
      getAllNotes: {
        name: "get notes",
        description: "get all notes",
        type: new GraphQLList(NoteType),
        args: NoteArgs,
        resolve: getAllNotes,
      },
    },
  }),
});
