const fs = require("fs");
const qs = require("qs");
const axios = require("axios");
const YahooFantasy = require("yahoo-fantasy");
var AWS = require("aws-sdk");

let awsConfig = {
  "region" : "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId":"AKIASM2S677I6DGOD7OA",
  "secretAccessKey":"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"
};

const getRoster = async(league_key) => {
  try {
    meta = await yf.roster.players(league_key);
    const RosterLength = meta.roster.length;
    console.log('roster length = '+ RosterLength);
    for(i=0;i<RosterLength;i++){
      console.log('key: ' + meta.roster[i].player_key 
        + ', name: ' + meta.roster[i].name.full
        + ', headshot: ' + meta.roster[i].headshot.url
        + ', team: ' + meta.roster[i].editorial_team_abbr
        + ', position: ' + meta.roster[i].display_position
        + ', undrop?: ' + meta.roster[i].is_undroppable
      );
    }
  } catch (e) {
    console.log(e.description);
  }
};

const getWaiverPlayersJet = async(league_key) => {
  try {
    var meta2 = await yf.league.playersJRG(league_key,1);
    var initVAL = meta2.players.length;
    var count = initVAL;

    while(initVAL >= 1 ){

      for(i=0;i<initVAL;i++){
        console.log('key: ' + meta2.players[i].player_key
          + ', name: ' + meta2.players[i].name.full
          + ', headshot: ' + meta2.players[i].headshot.url
          + ', team: ' + meta2.players[i].editorial_team_abbr
          + ', position: ' + meta2.players[i].display_position
        );
      }
      
      meta2 = await yf.league.playersJRG(league_key,count+1);
      initVAL = meta2.players.length;
      count = count + initVAL;
    }
    console.log('number of waiver players = ' + count);
  } catch (e) {
    console.log(e.description);
  }
};

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

var league_key = 'nfl.l.53605.t.9';

const yf = new YahooFantasy(
  "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
  "1486c440b69b08065a4ae8c35b94785973d26873",
)

user_id = 'jgearhea@gmail.com';

let newToken = getRefresh('AAE6y2HfIxKmf7NpFWQnGFhS0h_zHXHINwtW7jwvQXKGOU.pcZM1Y_tS0MY-');

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

  yf.setUserToken(access_tokenOut);

  //const metaOUT = getRoster(league_key);
  const meta2 = getWaiverPlayersJet(league_key);

});

