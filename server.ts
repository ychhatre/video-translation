import express from "express";
import cors from "cors";
import fs from "fs";
import * as redis from "redis";
import { uuid } from "uuid";

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
console.log("Video length is " + videoLength / 1000);

let totalRequests = 0;

// async function getCachedData(jobID: any) {
//   fs.readFile("public/jobs.json", "utf8", (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       if (data.length != 0) {
//         const jobs = JSON.parse(data);
//         let job;
//         for (let i = 0; i < jobs.length; i++) {
//           if (jobs.id === jobID) {
//             job = jobs[i];
//           }
//         }
//         return job;
//       }
//       return null;
//     }
//   });
// }

// async function setCachedData(jobID: any, options: Object) {
//   let obj: { [key: string]: any[] } = {
//     jobs: [],
//   };
//   fs.readFile("public/jobs.json", "utf8", (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // if the file is initially empty
//       if (data.length != 0) {
//         obj = JSON.parse(data);
//       }
//       if (!obj.jobs.some((e) => e.id === jobID)) {
//         options["id"] = jobID;
//         obj.jobs.push({ options });
//         const json = JSON.stringify(obj);
//         fs.writeFile("public/jobs.json", json, "utf8", () => {});
//       }
      
//     }
//   });
// }

async function updateStatsData(information: any) {
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
  const params: any = req.query;
  let timeElapsed = Date.now() - startTime;
  totalRequests += 1;

  if (timeElapsed < videoLength) {
    // if video is still loading
    const options = { status: "pending", timeLeft: videoLength - timeElapsed };
    // setCachedData(params.jobID, options);
    return res.status(202).json({ status: "pending" });
  } else if (Math.random() < 0.1) {
    // if there is an error after the video is done loading (Math.random() used to simulate random errors)
    return res.status(502).json({ status: "error" });
  } else if (timeElapsed > videoLength) {
    // update our local stats.json
    updateStatsData({
      constant: parseInt(params.constant),
      elapsedTime: timeElapsed / 1000, // in seconds
      requests: totalRequests - 1,
      delay: (timeElapsed - videoLength) / 1000, // how much longer it took than it should have
      configurableDelay: videoLength // how long the video took to process
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
