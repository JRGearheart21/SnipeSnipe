src="js/config.js"
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
            sport_val = data.Item.sport;
            numbInt = parseInt(data.Item.num_leagues); 

            if(numbInt >= 1){
                document.getElementById('addLeagueBtn').style.display = "none";
                document.getElementById('goToLeague').style.display = "block";
                document.getElementById('removeLeagueBtn').style.display = "block";


                document.getElementById("leage_num").value = league_id_val;
                document.getElementById("team_num").value = team_id_val;
                document.getElementById("sport").value = sport_val;

                
                const ws = new WebSocket("ws://localhost:443");
                    ws.addEventListener("open",() => {
                        console.log("We are now connected");
                        ws.send(''+sport_val+'.l.'+league_id_val+'.t.'+team_id_val+'$$$'+access_valOut);
                    });      
                    //functionEnd();
            }
            else{
                document.getElementById('addLeagueBtn').style.display = "block";
                console.log("No leagues");
            }
        }
    });
} 

function displayLeagueInfo(user_id){
} 

function insertLeague(user_id,league_idOut,team_idOut,sport_Out) {
    document.getElementById('addLeagueBtn').style.display = "none";
    document.getElementById('removeLeagueBtn').style.display = "block";
    document.getElementById('goToLeague').style.display = "block";

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
        TableName: "fasniper_users",
        Key:{
            "fas_user_ID": user_id,
            "AWS_client_ID": user_id,
        },
        UpdateExpression: "set league_id = :li, team_id=:ti, sport=:sp, num_leagues=:nl",
        ExpressionAttributeValues:{
            ":li":league_idOut.toString(),
            ":ti":team_idOut.toString(),
            ":sp":sport_Out.toString(),
            ":nl":1
        }
        };
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Unable to add item");
        } else {
            console.log("League Added!");
        }
    });
    
} 

function removeLeague(user_id) {
    document.getElementById('removeLeagueBtn').style.display = "none";
    document.getElementById('goToLeague').style.display = "none";
    document.getElementById('addLeagueBtn').style.display = "block";

    document.getElementById("leage_num").value = '';
    document.getElementById("team_num").value = '';
    document.getElementById("sport").value = '';

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
        TableName: "fasniper_users",
        Key:{
            "fas_user_ID": user_id,
            "AWS_client_ID": user_id,
        },
        UpdateExpression: "set league_id = :li, team_id=:ti, sport=:sp, num_leagues=:nl",
        ExpressionAttributeValues:{
            ":li":'',
            ":ti":'',
            ":sp":'',
            ":nl":0
        }
        };
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Unable to add item");
        } else {
            console.log("League Deleted!");
        }
    });
    
} 

function openLeague(){
    window.open('league.html','_self');
}


function closeWindow(){
    window.close();
}

function functionEnd(){
    console.log('sent to server2');
}

