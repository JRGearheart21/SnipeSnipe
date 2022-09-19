var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'fantasysports.yahooapis.com',
  'path': '/fantasy/v2/league/nfl.l.1461770/transactions',
  'headers': {
    'Authorization': 'Bearer vEGaKqKcpV14gWrrfDoEvvFqxhmebAntp4diUjvVIpygeAZqWMEb6qZhGfbB5o2coA1Kk5hH1UezwuwVMpFdxPScn1enLMnw3dJ.I9oIQi__jkeCDAxYwIJfkByZ2SwXEZAbjI64hDyJUf4HMatPKlpas1ruEZgVTwgYx826xvDETOX0MW5RYCvnEYaQWAjcQVmdIRCDu4UE.eB8H912FpNEdagH72lVsfFjt5lh_5jAghUQ0PowQPcUWOpwpmN48AGBCyiUHmiQ4HDnBqSW_Hz90lkqmybfEavU_lHzGGL6h4sS0fBnOvmNuF1g5ksfy_iq8i5Amks7gDE0fad7ce1.6I3jAqftrEj.k0jRvWDNJTawdJ_9bqysmuFf1kOm.Af6ZxYO7l3Qt0WG0GIHtxQCSPnP6k.UyBGUP_vT.acAWwk9P2RD79Qt87I9wRxRsuSISVbWL7RdrFqtQbS.zBODhaU4idzF8hmeTNw8uBexP.nS_d9vzEGhk36NAdWHs3dyOEuj0K7ZhNCjfBtBerQyC6zinUeYjESjVdnnTWcPCEgU0sm66Y520Q7PJPCferTqy..xtookMcA3QztGylHGwdTCLJSOqA9hupqkcM7SjHlJgcbC8VZvV3BVW_eOYFivM8QCuzZCqsPpmZuLHgN2GjWHPgwhvVbtQZQgcUtb98wj.VMK6KLONL8ciX5viXqihpWifxggnRPD8iGscIunRQlGV1KE5FJpxCAcBf7B44qoaYd6W_EMSwI4xiRRe4vVzahu0JZBOq7nq_ByTS9OHvMhFM4LVEXYTvHZBdhM_72KNlDHO0gtpfWUNm1UKxYN7blfD1nPbpaMsq7Tj4QZxS8RbzHJdJ9zpivWqqqg74qYNeFD5GlaP9G9TXM22Zuz4H9OsqbvoHS7YrHLUz0L47bFyxR1wC0CwFE3NlpMx922lv7PwT0qR9CqjmaWuHzLcCRnQARCaUp9YekFfClyO4uq5gI9xoHk3XYm6OQhtLqir0lBDYy2I05CXMLzkNphEBZngM5Y03Vu5S2J3ZhraaXdorb0o6pUNVk-',
              //^^access token
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

var postData = "<fantasy_content>\r\n<transaction>\r\n<type>add/drop</type>\r\n<players>\r\n<player>\r\n<player_key>nfl.p.32723</player_key>\r\n<transaction_data>\r\n<type>add</type>\r\n<destination_team_key>nfl.l.1461770.t.1</destination_team_key>\r\n</transaction_data>\r\n</player>\r\n<player>\r\n<player_key>nfl.p.30132</player_key>\r\n<transaction_data>\r\n<type>drop</type>\r\n<source_team_key>nfl.l.1461770.t.1</source_team_key>\r\n</transaction_data>\r\n</player>\r\n</players>\r\n</transaction>\r\n</fantasy_content>";

req.write(postData);

req.end();