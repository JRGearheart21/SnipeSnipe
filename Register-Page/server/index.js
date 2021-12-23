const WebSocket = require("ws");
const fs = require("fs");
const yahoo = require("./yahooFantasyBaseball");

const wss = new WebSocket.Server({port: 8083});

wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", dataIn => { 
        console.log("Client has sent us:" + dataIn);
        getData(dataIn);
        ws.close();
    });
    
    ws.on("close", () => {
            console.log("Client has disconnected");
        });
});

const getData = async(dataIn) => {
    try {
      // Read credentials file or get new authorization token
      await yahoo.yfbb.readCredentials(dataIn); 

      // If crededentials exist
      if (yahoo.yfbb.CREDENTIALS) {  
        const freeAgents = await yahoo.yfbb.getFreeAgents();
        console.log(`Getting free agents...`);
  
        const allData = {
          "free agents": freeAgents
        };
  
        const data = JSON.stringify(allData);
  
        const outputFile = "./allMyData.json";
  
        // Writing to file
        fs.writeFile(outputFile, data, { flag: "w" }, (err) => {
          if (err) {
            console.error(`Error in writing to ${outputFile}: ${err}`);
          } else {
            console.error(`Data successfully written to ${outputFile}.`);
          }
        });
      }
    } catch (err) {
      console.error(`Error in getData(): ${err}`);
    }
  }