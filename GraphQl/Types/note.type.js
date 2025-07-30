import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt
} from "graphql";



    export const NoteType = new GraphQLObjectType({
        name: "note",
        description: "this is note type",
        fields: {
        _id: { type: GraphQLID },
        title:{type:GraphQLString},
        content:{type:GraphQLString},
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        summary: { type: GraphQLString },
        ownerId:{
            type: new GraphQLObjectType({
                name: "User",
                description: "this is user type",
                fields: {
                    _id: { type: GraphQLID },
                    email: { type: GraphQLString },
                }
            })
        }
        },
    });
    
    
    export const NoteArgs ={
        title:{type:GraphQLString},
        content:{type:GraphQLString},
        ownerId:{type:GraphQLID},
        page:{type: GraphQLInt},
        limit:{type: GraphQLInt},
        token:{type:GraphQLString},
    }