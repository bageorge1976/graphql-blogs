import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";

// A map of functions which return data for the schema.
// const resolvers = {
//   Query: {
//     hello: () => "world",
//   },
// };

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }), // ✅ adds UI at /graphql
  ],
});
await server.start();

//app.use(cors(), bodyParser.json(), expressMiddleware(server));
// IMPORTANT: JSON middleware must come before expressMiddleware(server)
app.use(
//  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server)
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);