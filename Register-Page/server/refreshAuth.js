const WebSocket = require("ws");
const fs = require("fs");
const qs = require("qs");
const axios = require("axios");
var AWS = require("aws-sdk");
const YahooFantasy = require("yahoo-fantasy");

const wss = new WebSocket.Server({port: 1217});
let awsConfig = {
  "region" : "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId":"AKIASM2S677I6DGOD7OA",
  "secretAccessKey":"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"
};

wss.on("connection", ws => {
  console.log("New client connected");
  ws.on("message", dataIn => {  
    
    if(dataIn.includes('###')){
      //get League Info for League addition on Profile
      var refresh_tokenIn = dataIn.toString().split("###")[1];
      var user_id = dataIn.toString().split("###")[0];
    } 

    let newToken = getRefresh(refresh_tokenIn); 
                          
    newToken.then(function(result){
      access_tokenOut = result.data.access_token;
      refresh_tokenOut = result.data.refresh_token;
      var params = {
        TableName: "fasniper_users",
        Key:{
          "fas_user_ID": user_id,
          "AWS_client_ID": user_id,
        },
        UpdateExpression: "set access_token = :at, refresh_token=:rt",
        ExpressionAttributeValues:{
          ":at":access_tokenOut.toString(),
          ":rt":refresh_tokenOut.toString()
        }
      };
      setTable(params);

    });
  });
    
  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});

let getRefresh = function(dataIn){
  valstring = Buffer.from(`dj0yJmk9emE3blNFNkJta1ZoJmQ9WVdrOVNWTlBVWEZ2TkdRbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWE2:93d4fef055c7c539e563491cb31cd9dfcfe49dd0`, `binary`).toString(`base64`);
  return axios({
    url: `https://api.login.yahoo.com/oauth2/get_token`,
    method: "post",
    headers: {
      Authorization: `Basic ${valstring}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
    },
    data: qs.stringify({
      redirect_uri: "oob",
      grant_type: "refresh_token",
      refresh_token: dataIn
    })
  }).catch((err) => {
    console.error(`Error in refreshAuthorizationToken(): ${err}`);
  });
}

let setTable = function(params){
  AWS.config.update(awsConfig);
  let docClient = new AWS.DynamoDB.DocumentClient();
    docClient.update(params,function(err,data){
      if (err){
        console.log("error" + JSON.stringify(err,null,2));
      }
      else{
        console.log("success");// " + JSON.stringify(data,null,2));
      }
    })
}