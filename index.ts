import http from "http";
import * as mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
// import socialRoutes from "@colyseus/social/express"
import { hooks } from "./src";
import { MyRoom } from "./room/MyRoom";
import socialRoutesExpress from "./express";

import Question from './my_models/Questions'
import User from './src/models/User'

const port = Number(process.env.PORT || 2567);
const app = express()
const uri: string = "mongodb://127.0.0.1:27017/wordracer";

import * as QuestionController from './my_models/QuestionController'


app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define('my_room', MyRoom);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
//app.use("/colyseus", monitor());


app.get("/questions", QuestionController.allQuestions);
app.get("/question/:id", QuestionController.getQuestion);
app.post("/question", QuestionController.addQuestion);
app.put("/question/:id", QuestionController.updateQuestion);
app.delete("/question/:id", QuestionController.deleteQuestion);

app.use("/", socialRoutesExpress);




hooks.beforeAuthenticate((provider, $setOnInsert, $set) => {
  // assign default metadata upon registration
  $setOnInsert.avatarUrl = "default.png";
  $setOnInsert.metadata = {
    point: 100,
    diamonds: 0
  };
});
import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
    // list of users and passwords
    users: {
        "admin": "admin",
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor());

gameServer.listen(port);

console.log(`Listening on ws://localhost:${ port }`)
