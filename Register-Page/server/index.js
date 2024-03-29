const WebSocket = require("ws");
const fs = require("fs");
const qs = require("qs");
const yahoo = require("./yahooFantasyBaseball");
const axios = require("axios");
var AWS = require("aws-sdk");
const YahooFantasy = require("yahoo-fantasy");

var access_tokenOut = '';
var refresh_tokenOut = '';

const wss = new WebSocket.Server({port: 8083});
let awsConfig = {
  "region" : "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId":"AKIASM2S677I3SOLX2WG",
  "secretAccessKey":"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"
};

wss.on("connection", ws => {
  console.log("New client connected");

  ws.on("message", dataIn => {       
      var auth_code = dataIn.toString().split("&&")[1];
      var user_id = dataIn.toString().split("&&")[0];
      //console.log("user sent us: "+ dataIn)
      
      if(auth_code.includes("REFRESH")){
        var refresh_code = auth_code.split("REFRESH")[1];        
        let newToken= getRefresh(refresh_code);

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
      }
      else{
        let newToken = getAuth(auth_code);

        newToken.then(function(result){
          access_tokenOut = result.data.access_token;
          refresh_tokenOut = result.data.refresh_token;
        
          var params = {
            TableName: "fasniper_users",
            Key:{
              "fas_user_ID": user_id,
              "AWS_client_ID": user_id,
            },
            UpdateExpression: "set access_token = :at, auth_code=:ac, refresh_token=:rt",
            ExpressionAttributeValues:{
              ":at":access_tokenOut.toString(),
              ":ac":auth_code.toString(),
              ":rt":refresh_tokenOut.toString()
            }
          };

        setTable(params);
        });
      }
  });
    
  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});


let getAuth = function(dataIn){
      valstring = Buffer.from(`dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx:93d4fef055c7c539e563491cb31cd9dfcfe49dd0`, `binary`).toString(`base64`);
      return axios({
        url: `https://api.login.yahoo.com/oauth2/get_token`,
        method: "post",
        headers: {
          Authorization: `Basic ${valstring}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
        },
        data: qs.stringify({
          client_id: "dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx",
          client_secret: "93d4fef055c7c539e563491cb31cd9dfcfe49dd0",
          redirect_uri: "oob",
          code: dataIn,
          grant_type: "authorization_code",
        })


        }).catch((err) => {
          console.error(`Error in getInitialAuthorization(): ${err}`);
        });
}

let displayLeagueInfo = function(dataIn){
  valstring = Buffer.from(`dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx:93d4fef055c7c539e563491cb31cd9dfcfe49dd0`, `binary`).toString(`base64`);
  return axios({
    url: `https://api.login.yahoo.com/oauth2/get_token`,
    method: "post",
    headers: {
      Authorization: `Basic ${valstring}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
    },
    data: qs.stringify({
      client_id: "dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx",
      client_secret: "93d4fef055c7c539e563491cb31cd9dfcfe49dd0",
      redirect_uri: "oob",
      code: dataIn,
      grant_type: "authorization_code",
    })


    }).catch((err) => {
      console.error(`Error in getInitialAuthorization(): ${err}`);
    });
}

let getRefresh = function(dataIn){
  valstring = Buffer.from(`dj0yJmk9NVRBdG1ySXVzdjJyJmQ9WVdrOU4yVjVTakV4TkdnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWMx:93d4fef055c7c539e563491cb31cd9dfcfe49dd0`, `binary`).toString(`base64`);
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