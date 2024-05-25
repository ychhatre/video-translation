import Client from "client";

const options = {
  initialDelay: 1000,
  maxDelay: 5000,
  exp_constant: 1.25,
  maxRetries: 100,
};
const client = new Client("http://localhost:3000", options);
console.log("Client 1 is beginning job ");
setTimeout(() => {
  client.completeRequest();
  console.log(
    "Timeout being set to 5 seconds to allow Client #1 to process the request"
  );
}, 5000);
client.disconnectClient();

options["jobID"] = client.jobID;
const client2 = new Client("http://localhost:3000", options);
client2.completeRequest();
console.log("Client #2 is being used to resume the job monitoring");

