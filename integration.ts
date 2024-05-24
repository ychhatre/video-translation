import Client from "./client"; 


const client = new Client("http://localhost:3000", 1.5)
client.complete(1000, 5000)