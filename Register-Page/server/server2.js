const WebSocket = require("ws");
const fs = require("fs");
const qs = require("qs");
const yahoo = require("./yahooFantasyBaseball");
const axios = require("axios");
var AWS = require("aws-sdk");
const YahooFantasy = require("yahoo-fantasy");

const wss = new WebSocket.Server({port: 443});
let awsConfig = {
  "region" : "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId":"AKIASM2S677I6DGOD7OA",
  "secretAccessKey":"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"
};

wss.on("connection", ws => {
  console.log("New client connected");

  ws.on("message", dataIn => {       
    if(dataIn.includes('$$$')){
      var access_tokenOut = dataIn.toString().split("$$$")[1];
      var league_key = dataIn.toString().split("$$$")[0];
      const meta = calledFunction(league_key,access_tokenOut,ws);
    } else{
        ///other function within server2
    }
  });
    
  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});

const calledFunction = async(league_key,access_token,ws) => {
  const yf = new YahooFantasy(
    "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
    "1486c440b69b08065a4ae8c35b94785973d26873",
  )
  yf.setUserToken(access_token);

  try {
    const meta = await yf.team.meta(league_key);
    sendOutData(meta,ws);
  } catch (e) {
    console.log(e.description);
    ws.send(e.description);
  }
  /* try {
    const roster = await yf.roster.players(league_key);
    sendOutData(roster);
  } catch (e) {
    console.log(e);
  } */
}

function sendOutData(inData,ws){
  console.log(inData);
  ws.send("WORKS");
} 