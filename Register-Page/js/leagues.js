src="js/amazon-cognito-identity.min.js"
src="https://cdnjs.cloudflare.com/ajax/libs/web-socket-js/1.0.0/web_socket.min.js"

function xxxx(user_id) {
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
            "fas_user_ID": user_id.username,
            "AWS_client_ID": user_id.username,
            "num_leagues": 0
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item");
        } else {
            console.log(" Put User succeeded!!!!");
            window.open('login.html','_self');
        }
    });

} 

function closeWindow(){
    window.close();
}

