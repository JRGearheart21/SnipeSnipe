var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'fantasysports.yahooapis.com',
  'path': '/fantasy/v2/league/nfl.l.53605/transactions',
  'headers': {
    'Authorization': 'Bearer jTaiBrmb5hwaJ2y11KNBHhGIT6silTKF_4nPFN.KD6Q06ahqEWMBW.eapKnqFdaHTkTeNa7N1PZszXGl8HC09xTqZqvmstQz1I25jH9QCIKRduIYFUx6lb._i5k7sXEUK0r.mQPJ1God9cDco2uvHoFHvMvoCAAvsL_jIg2gg.T7F9fcvMK2n2bThRkBIKvbPpOsDoJ6LtPDVq1WAz9YSualx3w1IJ_2Zsf2wXcWJi4e6iOUCzCpS_B823b5WuBG72Tn7v9ZPHUk2deklwfzLFrDS1S.M_2oV87RF3oxriy4Vo4YsdPDs8YDRtnwmgza3crN9xLwIfNVyBCDu2oL.DCQCOpUaYLTeoMC92RPEZQu4bnYH8nCmjCpP6l1OwwGynccvUYGztYc1pr13HppnN3_INRPcUtGrKAj0NCRDdKs19lgkMFo8Yhbi1wxJGU0Cs8Z4fewG8XPDJoR_BlQK6xMq.6rHrXaDZSXbilws0B46DlEILhMNxANDdPtHmE985_wG_UIfeRlhhioHaIS5cbVGBn.uj3tTKtNCFHbl4R8Y5JG.go4kfUX1vyM5DtBSHb5sco3oxfg1D7RvX2.3Ul.GBWacnj4Lc.TJFiJ.Sc3UyjsR0UR3QqujyjtqH.j_Pl3jygyet67q0yGcC2AsfT..8vuQB9mxNK1Kvn27A9RfvIC9EbmNllJ6NSG5cjN0wbrUWTPGFmhBquTRwg1_9ZZ.SNSjNAKAF3.Ezx3c7DGuQahFLz77q_ahLb3AcUxKaB7XCvGhWFh43.LKLWcQwEyaDk6FU16XZIXzVQ.AS8snF_j3fSGJcNL4lat9uumjFSvVNc75J_r6Z8sEPtggSRWmLOWt9bZWWS2pKKM_m1FQZW.4xLjLhbtUEacovweTebnSTN7xtI1MoVcd46_qjt59YDyKLwrLSF73CX._WjURQI6E0YdhDyESUHGRET4aOsOyuAmxPSTwReP.hNiF2q_8LoG7rLSQnTP8.JCjiulMbSBNGmveU2SJeKcVfxXophyTA8.D4KeDgFbbEouAjpPPcCeLLrsjq3Nbsopk.sgdvapyA--',
    'Content-Type': 'application/xml'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = "<fantasy_content>\r\n<transaction>\r\n<type>add/drop</type>\r\n<players>\r\n<player>\r\n<player_key>nfl.p.29236</player_key>\r\n<transaction_data>\r\n<type>add</type>\r\n<destination_team_key>nfl.l.53605.t.9</destination_team_key>\r\n</transaction_data>\r\n</player>\r\n<player>\r\n<player_key>nfl.p.33391</player_key>\r\n<transaction_data>\r\n<type>drop</type>\r\n<source_team_key>nfl.l.53605.t.9</source_team_key>\r\n</transaction_data>\r\n</player>\r\n</players>\r\n</transaction>\r\n</fantasy_content>";

req.write(postData);

req.end();