
export const typeDefs = `
  type User {
    id: ID!
    email: String!
    profilePic: String
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    owner: User!
  }

  type Query {
    notes(
      userId: ID
      title: String
      startDate: String
      endDate: String
      limit: Int
      skip: Int
    ): [Note!]!
  }
`;
