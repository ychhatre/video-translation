import express from "express";
import cors from 'cors'; 
const server = express();
server.use(cors())
const PORT = 3000;

// server starts listening
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// startTime used as dummy for when client wants to "access a video"
const startTime = Date.now();

// approx time for video --> Math.random() used to simulate various different videos of sizes and lengths
const random = Math.random()
console.log(random)
const VIDEO_THRESHOLD = random * 10000; 

server.get("/status", (req, res) => {
  const timeElapsed = Date.now() - startTime;

  if (timeElapsed < VIDEO_THRESHOLD) { // if video is still loading
    return res.status(202).json({ status: "pending" });
  } else if (Math.random() < 0.10) { // if there is an error while the video is loading (Math.random() used to simulate random errors)
    return res.status(502).json({ status: "error" });
  } else if (timeElapsed > VIDEO_THRESHOLD) { // video fully loaded 
    return res.status(200).json({ status: "accepted" });
  }
});
