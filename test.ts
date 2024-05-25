import Client from "./client";
import { expect } from "chai";
import { describe, it, before, after, Done} from "mocha";
import fs from "fs";
import { ChildProcess, exec } from "child_process";

//TODO: write tests using mocha and chai!
describe("Client Integration Test Suite", () => {
  const options = {
    initialDelay: 1000,
    maxDelay: 5000,
    exp_constant: 1.25,
    maxRetries: 100,
  };

  let server: ChildProcess;
  before(async () => {
    // runs the command using a child_process
    server = exec("npm run dev");
    server.stdout.on("data", (data) => {
      console.log(data);
    });
    // gives time for the server to start booting up
    
  });

  after(() => {
    // kill process
    server.kill();
    // clear out both stats.json & jobs.json
    fs.writeFileSync("data/jobs.json", "");
    fs.writeFileSync("data/stats.json", "");
  });

  it("should complete request", async () => {
    const client = new Client("http:localhost:3000", options);
    const res = await client.completeRequest();
    expect(res).to.be.oneOf(["completed", "error"]);
  });

  it("should resume the job if interrupted", async () => {
    const client1 = new Client("http://localhost:3000", options);
    const jobID: any = client1.jobID;
    await client1.completeRequest();

    server.kill();
    server = exec("npm run dev");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    options["jobID"] = jobID;
    const client2 = new Client("http://localhost:3000", options);
    const resumedStatus = client2.completeRequest();
    expect(resumedStatus).to.be.oneOf(["completed", "error"]);
  });
});
