import { parentPort } from "worker_threads";
import { sendNotification } from "../Utils/notifications.js";

parentPort.on("message", async (job) => {
  try {
    const { userId, message, type, blogId, io } = job;
    await sendNotification(userId, message, type, blogId, io);
    parentPort.postMessage({ success: true, userId });
  } catch (error) {
    console.error(`Failed to process job for follower ${job.follower}: ${error.message}`);
    parentPort.postMessage({ success: false, error: error.message });
  }
});
