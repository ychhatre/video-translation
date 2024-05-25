import Client from "./client";

//TODO: write tests using mocha and chai!

const options = {
  initialDelay: 1000,
  maxDelay: 5000,
  exp_constant: 1.25,
  maxRetries: 100,
};
const client = new Client("http://localhost:3000", options);
client.completeRequest();
