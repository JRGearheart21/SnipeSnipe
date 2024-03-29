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
      //get access code and league key for mining
      var access_tokenOut = dataIn.toString().split("%%%")[1];
      var league_key = dataIn.toString().split("%%%")[0];
      //get roster (currently gets size of roster)
      const meta = getRoster(league_key,access_tokenOut,ws);   
    }
  });
    
  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});

const LeagueMeta = async(league_key,access_token,ws) => {
  const yf = new YahooFantasy(
    "dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx",
    "93d4fef055c7c539e563491cb31cd9dfcfe49dd0",
  )
  yf.setUserToken(access_token);

  try {
    const meta = await yf.team.meta(league_key);
    sendOutData('WORKS',ws);
  } catch (e) {
    console.log(e.description);
  }
}

const getRoster = async(league_key,access_token,ws) => {
  const yf = new YahooFantasy(
    "dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx",
    "93d4fef055c7c539e563491cb31cd9dfcfe49dd0",
  )
  yf.setUserToken(access_token);

  //getroster
  try {
    const meta1 = await yf.roster.players(league_key);
    sendOutData(JSON.stringify(meta1.roster),ws);

  } catch (e) {
    console.log(e.description);
  }

  //waiverclaims
  try {
    const meta2 = await yf.league.transactions2(league_key);
    sendOutData(JSON.stringify(meta2.transactions),ws);

  } catch (e) {
    console.log(e.description);
  } 

  //players on waivers
  try {
    var meta3 = await yf.league.playersJRG(league_key,0);
    var initVAL = meta3.players.length;
    sendOutData(JSON.stringify(meta3.players),ws);
    var count = initVAL;

    while(initVAL >= 1 ){
      var meta4 = await yf.league.playersJRG(league_key,count+1);

      initVAL = meta4.players.length;
      if(initVAL>=1){
      sendOutData(JSON.stringify(meta4.players),ws);
      count = count + initVAL;
      }
    }
    console.log('number of waiver players = ' + count);
  } catch (e) {
    console.log(e.description);
  }
}

function sendOutData(inData,ws){
  ws.send(inData);
} 