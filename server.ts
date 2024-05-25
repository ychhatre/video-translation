import express from "express";
import cors from "cors";
import fs from "fs";

const server = express();
server.use(cors());
const PORT = 3000;
// server starts listening
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// startTime used as dummy for when client wants to "access a video"
let startTime = Date.now();

// approx time for video --> Math.random() used to simulate various different videos of sizes and lengths
let videoLength = Math.random() * 10000;
console.log("Video processing length is " + videoLength / 1000 + " seconds!");

let totalRequests = 0;

// helper function get all jobs
function getAllStatuses() {
  const data = fs.readFileSync("data/jobs.json", "utf-8");
  return data.length != 0 ? JSON.parse(data) : null;
}

// helper function to get a specific job status
function getStatus(jobId) {
  const statuses = getAllStatuses();
  return statuses ? statuses[jobId] : null;
}

// helper function to set a specific job status
function setStatus(jobId, status) {
  let statuses = getAllStatuses();
  if (!statuses) {
    statuses = {};
  }
  statuses[jobId] = status;
  fs.writeFileSync(
    "data/jobs.json",
    JSON.stringify(statuses, null, 2),
    "utf-8"
  );
}

async function updateStatsData(information: any) {
  try {
    let obj = {
      stats: [],
    };
    const data = fs.readFileSync("data/stats.json", "utf8");
    if (data.length !== 0) {
      obj = JSON.parse(data);
    }
    obj.stats.push(information);
    const json = JSON.stringify(obj, null, 2);
    fs.writeFileSync("data/stats.json", json, "utf8");
  } catch (err) {
    console.error(err);
  }
}

server.get("/status", async (req, res) => {
  const params: any = req.query;
  let timeElapsed = Date.now() - startTime;

  let options = {
    constant: parseFloat(params.constant), // exponential backoff constant
    elapsedTime: timeElapsed / 1000, // time elapsed
    requests: totalRequests, // total amt of requests made in that time
    delay: (timeElapsed - videoLength) / 1000, // how much longer it took than it should have
    configurableDelay: videoLength / 1000, // how long the video took to process,
    startTime: Date.now(),
  };

  // params passes in as string so need to convert string to boolean
  const isCached = params.caching === "true";
  if (isCached) {
    let job = getStatus(params.jobID);
    if (job) {
      timeElapsed = Date.now() - job.startTime;
    }
  }

  console.log(
    `${timeElapsed / 1000} seconds have elapsed and ${
      ((videoLength - timeElapsed) / 1000)
    } seconds left to go`
  );
  totalRequests += 1;

  if (timeElapsed < videoLength) {
    options["status"] = "pending";
    setStatus(params.jobID, options);
    return res.status(202).json({ status: "pending" });
  } else if (Math.random() < 0.1) {
    // if there is an error after the video is done loading (Math.random() used to simulate random errors)
    return res.status(502).json({ status: "error" });
  } else if (timeElapsed > videoLength) {
    // update our local stats.json
    options["status"] = "accepted";
    setStatus(params.jobID, options);
    updateStatsData(options);
    return res.status(200).json({ status: "accepted" });
  }
});

server.get("/stats", async (_req, res) => {
  fs.readFile("data/stats.json", "utf8", (err, data) => {
    if (err) {
      console.log("error is: " + err);
    } else {
      const stats = JSON.parse(data);
      return res.status(200).send(stats);
    }
  });
});

export default server;
