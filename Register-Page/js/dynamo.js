src="js/config.js"
src="js/amazon-cognito-identity.min.js"
src="https://cdnjs.cloudflare.com/ajax/libs/web-socket-js/1.0.0/web_socket.min.js"



function insertUser(user_id, auth_code) {
    
    const ws = new WebSocket("ws://localhost:8083");
    
    ws.addEventListener("open",() => {
        console.log("We are now connected");
        ws.send(user_id + '&&'+ auth_code);
        window.close();
    });
     
}

function AWSupload(user_id,auth_code){
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
        Item:{
            "fas_user_ID": user_id,
            "AWS_client_ID": user_id,
            "auth_code":auth_code
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item");
        } else {
            console.log(" Put User succeeded!!!!");
            closeWindow();
        }
    }); 
    
}
function insertItem(waiverID, rosterID, priority) {
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
        Item:{
            "FAS_time": new Date(Date.now()).getTime(),
            "FAS_user": cognitoUser.username, 
            "rosterPlayer": rosterID,
            "waiverPlayer": waiverID,
            "FAS_priority": priority
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item");
        } else {
            console.log(" PutItem succeeded");
        }
    });
}

function removeItem() {
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
       Key:{
           "FAS_time":1637557634007,
           "FAS_user": "jgearhea@gmail.com"
       }
   };
    docClient.delete(params, function(err, data) {
        if (err) {
            console.log("error"+ JSON.stringify(err,null,2));
        } else {
            console.log(" get succeeded");
        }
    });
}

function getItem() {
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
       Key:{
           "FAS_time": 1637557634007,
           "FAS_user": "jgearhea@gmail.com"
       }
   };
    responseOut = docClient.get(params, function(err, data) {
        if (err) {
            console.log("error"+ JSON.stringify(err,null,2));
        } else {
            console.log(responseOut.response.data.Item);
        }
    });
}

function scanItem() {
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
       ProjectionExpression: "#usr,#tim",
       FilterExpression: "#tim > :timest AND begins_with(#usr,:usern)",
       ExpressionAttributeNames: {
            "#usr":"FAS_user",
            "#tim":"FAS_time"
       },
       ExpressionAttributeValues: {
            ":usern":"jgearhea@gmail.com",
            ":timest": 1
        }
   };
    responseOut = docClient.scan(params, function(err, data) {
        if (err) {
            console.log("error"+ JSON.stringify(err,null,2));
        } else {
            const urlstring=window.location.href;
            const spliturlstring = urlstring.split('code=')[1];

            const ws = new WebSocket("ws://localhost:8083");

            ws.addEventListener("open",() => {
                console.log("We are now connected");
                ws.send(spliturlstring);
            });

            ws.on("message" , receivedData => {
                console.log(receivedData);
                ws.close();
            });
        }
    });
}

function checkForRefreshToken(user_id){
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
      TableName :"fasniper_users",
      Key:{
          "fas_user_ID": user_id,
          "AWS_client_ID": user_id
      }
  };

    responseOut = docClient.get(params, function(err, data) {
        if (err) {
            console.log("error"+ JSON.stringify(err,null,2));
        } else {
          checkOutval = responseOut.response.data.Item.refresh_token;
          console.log(checkOutval);
          if((checkOutval!='')&&(checkOutval!=undefined)){
            console.log("YES there's a code");
            //refresh auth token
            window.open('profile.html','_self');
          }
          else{
            
            var ngrokport = '3db9';
            console.log("NO there is not");
            window.open('https://api.login.yahoo.com/oauth2/request_auth?client_id=dj0yJmk9ektRV0Z6dExNdTJqJmQ9WVdrOVkxWTBSMGRoTmpBbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTU5&redirect_uri=https%3A%2F%2F'+ngrokport+'-142-79-192-214.ngrok.io%2FRegister-Page%2Fredirected.html&response_type=code&language=en-us&state='+ user_id);
            window.open('profile.html','_self');

          }
        }
    });
}   

function closeWindow(){
    window.close();
}

