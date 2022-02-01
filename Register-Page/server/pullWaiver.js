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

var access_token = 'l5c.XwWb5hzdgwMHJUgIyAfVHdKuqVn8ju38PyYqfdulrME6NOS7.wHc_1qsINgqFetLkAhI8K8Pd78fbJp74ZLploPZ4ckWPt3XB7VpFf4ioFByI8jVE8UkDeCfEEk8JCuiT3sCp9s9gTiO6uSDlspX0pCmZdu_sLRgqkB8iB5X5kX2uVRFEscJfWlwbczDq0ZqevbHhlUxEBe_rzcggUyAAnQcFvUof9yvPM9iI7l56._cfJcxDmhxBvcp87tXD_xXTej8Fpsj5pd2wkn9LSqX505v2wx8YaogMeTURcfUV9Gty0P9GvLg40HgIiyDcKnXGxwC38dmGs8MN4S71wTqy0qH9_H_rvbzq27RS329M5DyEwbHgYSWwyBxrZ0BH4EHet7p4s0OXQaQVuVnXOJeqLGZOBDetbGh6UnlymSQXiuXOTGkG1.i7oY2TcNKDMv.jaAhfzJJmL8ZUH3SFKvbORFAj5WXFcA7l2JJ1Ds9o6xjdcFWgEzfbOJwI7nThJ11cIgRixfKNPPv49EypwcWcvVESuQ4qjlmf2HqSyj6Uw0NAi1RO4b0OH6dzy5sV6GNyzncjPi76Z3cgaYijmlb_Fb9uV8WHH72r78E5K.znp9QUD_htT3n82JMcxUKhVh_MAOm3OxoX5HCI3aE6qjWDjj1ETAjZycjiu_JzYmAN41XbaUrOFzwBX5DhAy3jaD4bu27PYfIXs1_bb1LegvW_yaafb_e94hfCyQsegIbMOMsHzABBWeoBTs7HrGRz01tMp5pN7OMBLtQNp7VZoTaHV3V4S9LdVwf3ihNRuH5huYcwJ_CMODbMvXJPp2_lYtaQLv5pR6dRet40uP669uewzDUb3gZ.ydlG1KHWtvHSamHd9NgWHx_qgwDe4n2k6CS96W_p7jDSMaGqpWNM5zRhJJoDN8_PtIu7maQcLdrG.H8ahVgNRxQJLHFCtHGT5FUErNslaVv4YdQyGEMlNoxtbnGYoPQ41VNU9kodOKJg9HPLsZaXhX00gh1W.PQxa89_GazmEPyzVMi7Nou.01WWjOrUHw2SYEP0LSYrPXdo4ogSg--';
var league_key = 'nfl.l.53605.t.9';
const yf = new YahooFantasy(
  "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
  "1486c440b69b08065a4ae8c35b94785973d26873",
)

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
    var count = 0;
    const meta = await yf.league.playersJRG(league_key,1);
    var initVAL = meta.players.length;

    while(initVAL == 25){

      for(i=0;i<initVAL;i++){
        console.log('key: ' + meta.players[i].player_key
          + ', name: ' + meta.players[i].name.full
          + ', headshot: ' + meta.players[i].headshot.url
          + ', team: ' + meta.players[i].editorial_team_abbr
          + ', position: ' + meta.players[i].display_position
        );
      }
      
      const meta2 = await yf.league.playersJRG(league_key,26+count);
      count = count + meta2.players.length;
      initVAL = meta2.players.length;
    }
    console.log('number of waiver players = ' + count);
  } catch (e) {
    console.log(e.description);
  }
};

yf.setUserToken(access_token);

//const meta2 = getWaiverPlayersJet(league_key);

const metaOUT = getRoster(league_key);