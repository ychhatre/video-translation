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
const random = Math.random();
console.log(random);
const VIDEO_THRESHOLD = random * 10000;


let totalRequests = 0;

async function updateData(information: any) {
  let obj: { [key: string]: any[] } = {
    stats: [],
  };
  fs.readFile("public/stats.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // if the file is initially empty
      if (data.length != 0) {
        obj = JSON.parse(data);
      }
      obj.stats.push(information);
      const json = JSON.stringify(obj);
      fs.writeFile("public/stats.json", json, "utf8", () => {});
    }
  });
}


server.get("/status", async (req, res) => {
  let params: any = req.params;
  if (!params.jobID) {
    return res.status(400).send({ error: "Job ID not found" });
  }

  const timeElapsed = Date.now() - startTime;
  totalRequests += 1;

  if (timeElapsed < VIDEO_THRESHOLD) {
    // if video is still loading
    return res.status(202).json({ status: "pending" });
  } else if (Math.random() < 0.1) {
    // if there is an error after the video is done loading (Math.random() used to simulate random errors)
    return res.status(502).json({ status: "error" });
  } else if (timeElapsed > VIDEO_THRESHOLD) {
    // update our local database
    updateData({
      constant: params.constant,
      elapsedTime: timeElapsed / 1000, // in seconds
      requests: totalRequests,
      delay: timeElapsed - VIDEO_THRESHOLD, // how much longer it took than it should have
    });

    return res.status(200).json({ status: "accepted" });
  }
});

server.get("/stats", async (_req, res) => {
  fs.readFile("public/stats.json", "utf8", (err, data) => {
    if (err) {
      console.log("error is: " + err);
    } else {
      const stats = JSON.parse(data);
      return res.status(200).send(stats);
    }
  });
});
