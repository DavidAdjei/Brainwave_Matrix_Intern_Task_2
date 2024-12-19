import { Worker } from "worker_threads";

/**
 * Process a job using a worker thread.
 * @param {string} workerPath - Path to the worker file.
 * @param {object} jobData - Data to be processed by the worker.
 * @returns {Promise} - Resolves when the worker completes the job.
 */
const processJobWithWorker = (workerPath, jobData) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath);
    worker.postMessage(jobData);

    worker.on("message", (response) => {
      if (response.success) {
        resolve(response); 
      } else {
        reject(new Error(response.error)); 
      }
    });

    // Handle worker errors
    worker.on("error", (error) => {
      reject(error); // Worker error
    });

    // Ensure proper cleanup on exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

export { processJobWithWorker };
