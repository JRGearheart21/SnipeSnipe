const fs = require("fs");
const qs = require("qs");
const axios = require("axios");
const YahooFantasy = require("yahoo-fantasy");

var access_token = '2pebcE6b5hzc4VhPU6hnp9RrsJ5jXCCXNjQ9wItnvzIrHyN0XHmGXRPYmVaueJ_vtnjXFk1yPvrKOYg_pH6L5iZmSe_7vcDvIfU7bcfpQrGWoESHfEyuxSfOtt49K1uXSdRnyUmN7abzEll5FqNN1.4RL4143h89LfaJVAurJsVgV8cEiJfd5_4Pc9I3SUmBo55zB6uUyztVGzWqy0euyt0JjyC7Z6FpQDCmDVdV8TKc70R3F45g5FWrmhmcdmfanudGkNydPbRZl7bOS_Yr_5M6PFLQJsQvzu3QKzA74S7_OrlYF5412xZDd9vEEG1HQ5hTCrjUbpSiIYCSDKh2suCot76z1PixR.X4z7HGc.NWX58jnaC7AmN4jLIp87uzR1edPGreg0mz7Yzx0gAPCH4nhaqixMPIUYuyImhpvMjizUQVRs_Pe30_HkV6ucyGyf5bxAFJuWXXCbaVchJT2sQ__pOiAdjwZiOL3d.bW45lcj81UQRsyVfjfc_c.HJIz2waOIwcc4nK8KWC4SWktFTLUZrC2WIlBmscYci2nx3haQRE3SAPvqwR5r6sQmp6xYqTfGLI81OqRHQKtwydsl_Y6rMOtFZqurG64hAYwkkHr2btw.oGs94kdecML54uYggCtNQW3YtRSazj0vUZFHJrmSAtew_sqsoCvZ21f9gtlXuZoITAIJHRP6IVVN1waR5AWuAo8IX2IHhy4BBXh_..T1Og3VPdCqaue9ifRtm3nKzeGgrcvHzOr_G4prq9VVcsnosvWqm5zGUnx2noxhNbsQDVFsouU08.ENlCHmySxxzhCmXac.YGrHYjfWlUvWYDenU1.EXz01XmQQJ6aoNZ6RhJwmTcddORIVTWeSGubPi6gw6B2P1AlfwJji.Lacv6pGh5w8j33Z_gB8sAhR6RwSVDnCk5aIX4vOIPQyLTHcJ1QDic4u2rfksswvlTiDFIJWEcC2A9fZXwVFErnEuugSFX2B5fz5NzYA2jQCkTiLKQWmcyd.S6m9g6IueX5Th9Dkv9Uw8H5iKFPpwSzJLXnPh8kDi8eXPDRsU7xSAkOFTGYA--';
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
                  + ', position: ' + meta.roster[i].eligible_positions
      );
    }
  } catch (e) {
    console.log(e.description);
  }

};

const getWaiverPlayersJet = async(league_key) => {
  var count = 0;
  const meta = await yf.league.playersJRG(league_key,1);
  var initVAL = meta.players.length;

  while(initVAL == 25){

    for(i=0;i<initVAL;i++){
      console.log('key: ' + meta.players[i].player_key
                  + ', name: ' + meta.players[i].name.full
                  + ', headshot: ' + meta.players[i].headshot.url
                  + ', team: ' + meta.players[i].editorial_team_abbr
                  + ', position: ' + meta.players[i].eligible_positions
      );
    }
    
    const meta2 = await yf.league.playersJRG(league_key,26+count);
    count = count + meta2.players.length;
    initVAL = meta2.players.length;
  }
  console.log('number of waiver players = ' + count);
};


yf.setUserToken(access_token);

//const meta1 = yf.league.transactions(league_key);
const meta2 = getWaiverPlayersJet(league_key);

//const metaOUT = getRoster(league_key);