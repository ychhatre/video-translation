import express from "express";

const server = express();
const PORT = 3000;

const startTime = Date.now();
const VIDEO_THRESHOLD = Math.random() * 1000;
server.get("/status", (req, res) => {
  const timeElapsed = Date.now() - startTime;

  if (timeElapsed < VIDEO_THRESHOLD) {
    return res.status(202).json({ status: "pending" });
  } else if (Math.random() < 0.4) {
    return res.status(502).json({ status: "error" });
  } else if (timeElapsed > VIDEO_THRESHOLD) {
    return res.status(200).json({ status: "accepted" });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
