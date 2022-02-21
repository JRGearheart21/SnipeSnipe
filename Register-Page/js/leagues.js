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
            }
            else{
                document.getElementById('addLeagueBtn').style.display = "block";
                console.log("No leagues");
            }
        }
    });
} 

function getAWSTransactions(user_id,league_key) { 
    var waiverNames = ['waiverPlayer1','waiverPlayer2','waiverPlayer3','waiverPlayer4','waiverPlayer5'];
    var rosterNames = ['rosterPlayer1','rosterPlayer2','rosterPlayer3','rosterPlayer4','rosterPlayer5'];
    var FAStimes = ['FAS_time1','FAS_time2','FAS_time3','FAS_time4','FAS_time5'];
    var priorityNames = ['priority1','priority2','priority3','priority4','priority5'];

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
   var cognitoUser = userPool.getCurrentUser(); 

   var params = {
       TableName :"FAS_server_data1",
       ProjectionExpression: "#usr,#tim,#lge,#rpl,#pri,#wpl",
       FilterExpression: "#tim > :timest AND begins_with(#usr,:usern) AND begins_with(#lge,:league) AND begins_with(#rpl,:rostplay) AND begins_with(#pri,:prioriT) AND begins_with(#wpl,:waivePlay)",
       ExpressionAttributeNames: {
            "#usr":"FAS_user",
            "#tim":"FAS_time",
            "#lge":"FAS_league",
            "#rpl":"rosterPlayer",
            "#pri":"FAS_priority",
            "#wpl":"waiverPlayer"
       },
       ExpressionAttributeValues: {
            ":usern":user_id,
            ":timest": 1,
            ":league":league_key,
            ":rostplay":'',
            ":prioriT":'',
            ":waivePlay":''
        }
   };
    responseOut = docClient.scan(params, function(err, data) {
        if (err) {
            console.log("error"+ JSON.stringify(err,null,2));
        } else {
            console.log(responseOut.response.data.Items);
            for(i=1;i<=responseOut.response.data.Items.length;i++){
                document.getElementById(waiverNames[responseOut.response.data.Items[i-1].FAS_priority-1]).value=responseOut.response.data.Items[i-1].waiverPlayer;
                document.getElementById(rosterNames[responseOut.response.data.Items[i-1].FAS_priority-1]).value=responseOut.response.data.Items[i-1].rosterPlayer;
                document.getElementById(priorityNames[responseOut.response.data.Items[i-1].FAS_priority-1]).value=responseOut.response.data.Items[i-1].FAS_priority;
                document.getElementById(FAStimes[responseOut.response.data.Items[i-1].FAS_priority-1]).value=responseOut.response.data.Items[i-1].FAS_time;
            }
        }
    });
}

function getRosterWaiverPlayersYahooClaims(username,league_key1){ //finish parsing waiver claims and other info into website JRG
    var yahoo_waiverNames = ['yahoo_waiverPlayer1','yahoo_waiverPlayer2','yahoo_waiverPlayer3','yahoo_waiverPlayer4','yahoo_waiverPlayer5'];
    var yahoo_rosterNames = ['yahoo_rosterPlayer1','yahoo_rosterPlayer2','yahoo_rosterPlayer3','yahoo_rosterPlayer4','yahoo_rosterPlayer5'];

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
            "fas_user_ID": username,
            "AWS_client_ID": username
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            access_valOut = data.Item.access_token;
               const ws = new WebSocket("ws://localhost:443");
                ws.addEventListener("open",() => {
                    ws.send(''+league_key1+'%%%'+access_valOut);
                });  
                ws.addEventListener("message", function(messageEvent) { 
                    var obj = JSON.parse(messageEvent.data);
                    var i = 0;
                    var looplen = 0;

                    if(obj[0].waiver_date!=undefined){
                        console.log(' ');
                        console.log('waiver claims: ');
                        looplen = parseInt(obj.length);

                        for(i=0;i<looplen;i++){

                            if(obj[i].players.length<2){
                                console.log(obj[i].transaction_key);
                                console.log('add: ' + obj[i].players[0].name.full);
                                console.log('drop no one');
                                document.getElementById(yahoo_waiverNames[i]).value=obj[i].players[0].name.full;
                                document.getElementById(yahoo_rosterNames[i]).value='No One';

                            }
                            else{
                                console.log(obj[i].transaction_key);
                                console.log('add: ' + obj[i].players[0].name.full);
                                console.log('drop: ' + obj[i].players[1].name.full);
                                document.getElementById(yahoo_waiverNames[i]).value=obj[i].players[0].name.full;
                                document.getElementById(yahoo_rosterNames[i]).value=obj[i].players[1].name.full;

                            }
                        }
                       
                    }
                    else if(obj[0].selected_position!=undefined){ //add roster players to search list JRG
                        console.log(' ');
                        console.log('roster: ');
                        looplen = parseInt(obj.length);

                        for(i=0;i<looplen;i++){
                            console.log(obj[i].name.full);
                        }

                    }
                    else{ //add players on waivers to search list JRG
                        console.log(' ');
                        console.log('players on waivers: ');
                        looplen = parseInt(obj.length);
                        console.log(obj);
                    }
                });
        }
    });
}

function checkLeagueInfoValidity(user_id,league_idOut,team_idOut,sport_Out,access_valOut){
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
            const ws = new WebSocket("ws://localhost:443");
            ws.addEventListener("open",() => {
                ws.send(''+sport_Out+'.l.'+league_idOut+'.t.'+team_idOut+'$$$'+access_valOut);
            });  
            ws.addEventListener("message", function(messageEvent) { 
                if(messageEvent.data != "WORKS"){
                    alert(messageEvent.data);
                }
                else{
                    insertLeague(user_id,league_idOut,team_idOut,sport_Out);
                }
            });  
        }
    });
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

function openLeague(league_num,team_num,sport){
    window.open('league.html?sport='+sport+'&league='+league_num+'&team_num='+team_num,'_self');
}

function closeWindow(){
    window.close();
}

function functionEnd(){
    console.log('sent to server2');
}