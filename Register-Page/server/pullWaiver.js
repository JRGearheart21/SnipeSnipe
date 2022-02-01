const fs = require("fs");
const qs = require("qs");
const axios = require("axios");
var AWS = require("aws-sdk");
const YahooFantasy = require("yahoo-fantasy");

let awsConfig = {
  "region" : "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId":"AKIASM2S677I6DGOD7OA",
  "secretAccessKey":"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"
};

var access_token = 'zp1ZpRSb5hznAKwdEC9j_TmuauEKyEkdfWJ9gMHI2g1q4bEsiievMwQZGu2JyLkAwJjUeZjzssDy5RK1OgNZTlYLvQMQ4cFrMr1SvTKzd5IHJZuldt6C35MJuwbF5obf2tDBiCuJ_KnaVwsGMxpyTCK4nbzXIupCW3bm.knE4AswX_WwAUs9fuKXBKBhlsCeGJ4D7I2naBgnVv4aGp.3BQsWYFzZW5xz79IWYIPAyHUJM3myGwFE.EkeXAe4xdsXRIbfsdaHTg6q1c0ANT2QFW5qsKQCdyn7ngIXNwjP3HQ_y6j2YqG71.uRSGdHwwLMXIXSWC.YJQCbo2hCzxP.RZFIGxHzzaZ5F5FPZJDmM64WmAqOKPY4Fe5Un8TmVxJYhZ_9DrzeXa56FIxevVsDV75RxHCS5UrzhQkvyxvqtNYSUb2MrDqpIN5kgenfECbm9IEtlrBSM1BaojeT.lpAhd7iuBpffUGE1YsWWuJIQxVrr9DG3XO68PPKxZnYSiIAPixbmCcstW27W7c_NyqHyVlJPeANzGqA2hPMWv4kyAQMs73gkjcgWkvszHmDENJW.DYMCWoHtTu_RVA6mgaagvt49MmG4pVI.qvwCmmSCIBqg1_JbJZ.OzQLEBmfPgCJcc8q__JeRs4ue6xv84KOkTawvhMnLjh17FR1Eaxx.UeAirjUD.u0FB_gD2jteweG8s0AUomTSHhs0S_Jm9A6uzK0P4ZhJWxvL8U_MnVZ.p6YlSt7RKgEY_ReyzYAoVf3CGeYs.sx2kRbHo6JA.6HXNIK50dRqEa_Y8K8Y990RfsYlLTbwDYZP7.XsMn0IDhBlgKUGSTFHETA.hwSCYa52iH98FZuZlJvblRVnOgv.PoiuNdC3mRUDyi2VN__F8.nMff1ISDP3CmY_JNBzt07WW_CoVntzk7NrSQZFrSULJZx_quE_UhhSR8I6..bNgQsRfcaECowJDbznX0i4vDUmocaeu6TmI4aq1.fBPthJ4QUo_xZ.HIRvy2oBJoCAc009v.qSiTtgHfrZlIRR1y_KV6r4jQnBcP_pFGn4s5sMle4UYAyMw--';
var league_key = 'nfl.l.53605.t.9';
const yf = new YahooFantasy(
  "dj0yJmk9aXFpekN0NHQ0YWN1JmQ9WVdrOVZqSTVVM0ZDZEc0bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTll",
  "1486c440b69b08065a4ae8c35b94785973d26873",
)

const getRoster = async(league_key,access_token) => {
  meta = await yf.roster.players(league_key);
  console.log('roster length = '+ meta.roster.length);
};

const getWaiverPlayersJet = async(league_key,access_token) => {
  var count = 0;
  const meta = await yf.league.playersJRG(league_key,1);
  var initVAL = meta.players.length;

  while(initVAL == 25){
    const meta2 = await yf.league.playersJRG(league_key,26+count);
    count = count + meta2.players.length;
    initVAL = meta2.players.length;
  }
  console.log('number of waiver players = '+count);
};


yf.setUserToken(access_token);

//const meta1 = yf.league.transactions(league_key);
const meta2 = getWaiverPlayersJet(league_key,access_token);

const metaOUT = getRoster(league_key,access_token);