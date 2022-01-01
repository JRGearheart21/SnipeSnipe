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
  "accessKeyId":"AKIASM2S677I6DGOD7OA",
  "secretAccessKey":"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"
};

wss.on("connection", ws => {
  console.log("New client connected");

  ws.on("message", dataIn => {       
      var auth_code = dataIn.toString().split("&&")[1];
      var user_id = dataIn.toString().split("&&")[0];
      console.log("user sent us: "+ dataIn)
      if(auth_code.includes("REFRESH")){
        var refresh_code = auth_code.split("REFRESH")[1];        
        let newToken= getRefresh(refresh_code);

        newToken.then(function(result){
          //console.log(result);
          access_tokenOut = result.data.access_token;
          
          
          //JRGJRG
          const meta = calledFunction('nfl.l.53605',access_tokenOut);
          //JRGJRG    


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
      valstring = Buffer.from(`dj0yJmk9ektRV0Z6dExNdTJqJmQ9WVdrOVkxWTBSMGRoTmpBbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU5:bf52e499813f8c1fb25154a58b14d6c21df4b4e0`, `binary`).toString(`base64`);
      return axios({
        url: `https://api.login.yahoo.com/oauth2/get_token`,
        method: "post",
        headers: {
          Authorization: `Basic ${valstring}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
        },
        data: qs.stringify({
          client_id: "dj0yJmk9ektRV0Z6dExNdTJqJmQ9WVdrOVkxWTBSMGRoTmpBbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU5",
          client_secret: "bf52e499813f8c1fb25154a58b14d6c21df4b4e0",
          redirect_uri: "oob",
          code: dataIn,
          grant_type: "authorization_code",
        })


        }).catch((err) => {
          console.error(`Error in getInitialAuthorization(): ${err}`);
        });
}

let displayLeagueInfo = function(dataIn){
  valstring = Buffer.from(`dj0yJmk9ektRV0Z6dExNdTJqJmQ9WVdrOVkxWTBSMGRoTmpBbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU5:bf52e499813f8c1fb25154a58b14d6c21df4b4e0`, `binary`).toString(`base64`);
  return axios({
    url: `https://api.login.yahoo.com/oauth2/get_token`,
    method: "post",
    headers: {
      Authorization: `Basic ${valstring}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
    },
    data: qs.stringify({
      client_id: "dj0yJmk9ektRV0Z6dExNdTJqJmQ9WVdrOVkxWTBSMGRoTmpBbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU5",
      client_secret: "bf52e499813f8c1fb25154a58b14d6c21df4b4e0",
      redirect_uri: "oob",
      code: dataIn,
      grant_type: "authorization_code",
    })


    }).catch((err) => {
      console.error(`Error in getInitialAuthorization(): ${err}`);
    });
}

let getRefresh = function(dataIn){
  valstring = Buffer.from(`dj0yJmk9ektRV0Z6dExNdTJqJmQ9WVdrOVkxWTBSMGRoTmpBbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU5:bf52e499813f8c1fb25154a58b14d6c21df4b4e0`, `binary`).toString(`base64`);
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

const getData = async(dataIn) => {
    try {
      // Read credentials file or get new authorization token
      await yahoo.yfbb.readCredentials(dataIn); 

      // If crededentials exist
      if (yahoo.yfbb.CREDENTIALS) {  
        const freeAgents = await yahoo.yfbb.getFreeAgents();
        console.log(`Getting free agents...`);
  
        const allData = {
          "free agents": freeAgents
        };
  
        const data = JSON.stringify(allData);
  
        const outputFile = "./allMyData.json";
  
        // Writing to file
        fs.writeFile(outputFile, data, { flag: "w" }, (err) => {
          if (err) {
            console.error(`Error in writing to ${outputFile}: ${err}`);
          } else {
            console.error(`Data successfully written to ${outputFile}.`);
          }
        });
      }
    } catch (err) {
      console.error(`Error in getData(): ${err}`);
    }
  }

const calledFunction = async(league_key,access_token) => {
  const yf = new YahooFantasy(
    "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
    "1486c440b69b08065a4ae8c35b94785973d26873",
  )
  yf.setUserToken(access_token);

  try {
      const meta = await yf.league.meta(league_key);
      sendOutMeta(meta);
    } catch (e) {
      console.log(e);
    }
  }

function sendOutMeta(meta){
  console.log(meta);
}