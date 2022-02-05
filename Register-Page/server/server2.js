const WebSocket = require("ws");
const fs = require("fs");
const qs = require("qs");
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
      //get League Info for League addition on Profile
      var access_tokenOut = dataIn.toString().split("$$$")[1];
      var league_key = dataIn.toString().split("$$$")[0];
      const meta = LeagueMeta(league_key,access_tokenOut,ws);
    } 
    else if(dataIn.includes('%%%')){
      //get all necessary League information onLoad League page (Roster/Waiver/Pending Claims)
      //get access code and league key for mining
      var access_tokenOut = dataIn.toString().split("%%%")[1];
      var league_key = dataIn.toString().split("%%%")[0];

      //get roster (currently gets size of roster)
      const meta = getRoster(league_key,access_tokenOut,ws);    

      //get pending claims
      //const beezus = getTransactionsJet(league_key,access_tokenOut,ws);

      //get waiver players claims
      //const waivRider = getWaiverPlayersJet(league_key,access_tokenOut,ws);
    }
  });
    
  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});

const LeagueMeta = async(league_key,access_token,ws) => {
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
}

const getRoster = async(league_key,access_token,ws) => {
  const yf = new YahooFantasy(
    "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
    "1486c440b69b08065a4ae8c35b94785973d26873",
  )
  yf.setUserToken(access_token);

  try {
    const meta = await yf.roster.players(league_key);
    console.log(meta.roster.length);
  } catch (e) {
    console.log(e.description);
    ws.send(e.description);
  }
}

const getTransactionsJet = async(league_key,access_token,ws) => {
  const yf = new YahooFantasy(
    "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
    "1486c440b69b08065a4ae8c35b94785973d26873",
  )
  yf.setUserToken(access_token);
  console.log(league_key);
  try {
    const meta = await yf.league.transactions(league_key);
    //JRG to do filter through transactions and move to AWS
    console.log(meta);
  } catch (e) {
    console.log(e.description);
    ws.send(e.description);
  }
}

const getWaiverPlayersJet = async(league_key,access_token,ws) => {
  const yf = new YahooFantasy(
    "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
    "1486c440b69b08065a4ae8c35b94785973d26873",
  )
  yf.setUserToken(access_token);

  try {
    const meta = await yf.league.playersJRG(league_key);
    console.log(meta.players.length);
  } catch (e) {
    console.log(e.description);
    ws.send(e.description);
  }
}

function sendOutData(inData,ws){
  console.log(inData);
  ws.send("WORKS");
} 