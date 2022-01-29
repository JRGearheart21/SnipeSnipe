var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'fantasysports.yahooapis.com',
  'path': '/fantasy/v2/league/nfl.l.53605/transactions',
  'headers': {
    'Authorization': 'Bearer 1XIh8p6b5hxw51qq2JSunE_3jjSItto0yDD.ngRdi7wcsbFcl_Bmf6tz_suNXmV5PDOb4bcwi4g6o8a3f5GQLJjLgDrk67At7byGp9ZzdO.EQFSGtuha2skGxscnLNjHiqVkL3tAnE_SFU.B85XY5sKPdYnSRAHfanZxAD0fNXDfgJtvXKTWXg86OpW1At1rbfMg1pXIMb.gln34gRE4GSEarH9ACtP8aehB0k89GvxZPsD6HXdW9mq0ZE9CCpeb5w9U1GqE6OMeUwqHeby74KkzsHnC0jHuSnGXHCJCX.lw9gTAIgW.iBvmvosb2qmKVl6J85GahKnV_hEMLYphX59C1ht3qG8NZXYpKfX6z7pJO4rh__6mUAaYi4uF6jX.HIdoDpcr6pGBEc1vJy8_hI.F.BCjtHMr3gRtUCZAbyBceC27njGVsnRlSHqbbqvjtCLrybElf4doLCRwekR39am.om6yinJhx6HAoAXVV3H7N5Tu3tu14JA2OWl9_0SiiCuOGUq84EdZRzMgqeAesJv05vYCcUGIqSvsGdwBx3q1DMIuPzxsjUwJedTqiPNNuvHJ7gyAejmZNCYbAEba4CkVd346PC_0bpnioTPqayqst76MZoza.K.AfcV015ukhvXhr.LkksnsGNElJkmTyZOLvT2DVx2U3elZNt1.7qkUC1a5f6uQCo1VjfeTMr1nGbU2RCDwQBBPO2a8flrvc.u_BBNkc95MBff9ETGvd3QoGk1RRT43k6dOyxQjOpciRyDQHFGZozSTkXJgJ5IPVc4X8.rVoXYtbE.Wz4UEsFTbKNaXnMJr1LksF9hdCRHc.0NEPBasviovrPY2ZBdZedm.2ym11dLjLuBMOBjmnBvV1EbLPk56.ePNFN_JO6OX.muEiVzO4q0j9AH.M2tuJVnbhMRKGzNodj9DUMj8X_.CYWqobFuZ6dg0VdnchkVK3YqqdCxYF69yVoVsbNB2o6FJKgRxPaVgTm1ZH6gS4DYMOSHPT1YEdYzyuEol2GVD2Te5FtZKEvL.RqoWjCRO3_qlWg0amLzw9plqe8jnKxqQijNBAnw9wD1k30_lBR7nhiKaqyi2i9j.KMpoTrfX',
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