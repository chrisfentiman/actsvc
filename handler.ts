import { ApolloServer, gql } from "apollo-server-lambda";
import { AccountService } from "./comment.service";
import { Viewer } from "./viewer";

const typeDefs = gql`
  type Account {
    guid: String
    given_name: String
    family_name: String
    birthdate: String
    pin: Boolean
  }
  type Query {
    getAccount(userId: String): Account
  }
`;

const resolvers = {
  Query: {
    // Get Comments
    get: async (parent, args, context) => {
      const service = new AccountService();
      return await service.getAccount(args.userId, new Viewer(context.token));
    }
  }
  // Mutation: {
  // // Add Comments
  // add: (parent, args, context) => {
  //   const service = new CommentService();
  //   return service.addComments(args.itemId, args.userId, args.content);
  // },
  // //Edit Comment
  // edit: (parent, args, context) => {
  //   const service = new CommentService();
  //   return service.editComments(
  //     args.itemId,
  //     args.msgId,
  //     args.userId,
  //     args.content
  //   );
  // },
  // // Delete Comment
  // delete: (parent, args, context) => {
  //   const service = new CommentService();
  //   return service.deleteComments(args.itemId, args.msgId, args.userId);
  // }
  // }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    token: event.headers.authorization,
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

exports.graphqlHandler = server.createHandler();
