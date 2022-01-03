src="js/amazon-cognito-identity.min.js"
src="https://cdnjs.cloudflare.com/ajax/libs/web-socket-js/1.0.0/web_socket.min.js"

function numLeagues(user_id) {
    AWS.config.update({
        region: "us-east-2",
        accessKeyId: "AKIASM2S677I6DGOD7OA",
        secretAccessKey: "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"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    var data = { 
		UserPoolId : _config.cognito.userPoolId,
        ClientId : _config.cognito.clientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

    var params = {
        TableName :"fasniper_users",
        Key:{
            "fas_user_ID": user_id,
            "AWS_client_ID": user_id
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            access_valOut = data.Item.access_token;
            league_id_val = data.Item.league_id;
            team_id_val = data.Item.team_id;
            numbInt = parseInt(data.Item.num_leagues); 

            if(numbInt > 0){
                    const ws = new WebSocket("ws://localhost:443");
    
                    ws.addEventListener("open",() => {
                        console.log("We are now connected");
                        ws.send('nfl.l.'+league_id_val+'.t.'+team_id_val+'$$$'+access_valOut);
                    });      

                    functionEnd();

                }
                else{
                    console.log("No leagues");
                }
        }
    });

} 

function displayLeagueInfo(user_id){
} 


function closeWindow(){
    window.close();
}
function functionEnd(){
    console.log('sent to server2');
}

