import { Queue, Worker } from "bullmq";
import { CART_TIMEOUT_MS } from "../config/constants.js";
import { redisUrl } from "../config/redis.js";

const CART_TIMEOUT_JOB_ID = "cart-timeout";
const QUEUE_NAME = "cart-timeouts";

const cartTimeoutQueue = new Queue(QUEUE_NAME, {
  connection: { url: redisUrl },
});

new Worker(
  QUEUE_NAME,
  async () => {
    console.log("timeout");
  },
  { connection: { url: redisUrl } }
);

export const scheduleCartTimeout = async () => {
  const existingJob = await cartTimeoutQueue.getJob(CART_TIMEOUT_JOB_ID);
  if (existingJob) {
    await existingJob.remove();
  }
  await cartTimeoutQueue.add(
    "cart-timeout",
    {},
    {
      jobId: CART_TIMEOUT_JOB_ID,
      delay: CART_TIMEOUT_MS,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};

export const clearCartTimeout = async () => {
  const existingJob = await cartTimeoutQueue.getJob(CART_TIMEOUT_JOB_ID);
  if (existingJob) {
    await existingJob.remove();
  }
};
