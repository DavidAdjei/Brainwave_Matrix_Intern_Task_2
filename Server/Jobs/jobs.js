// import schedule from "node-schedule"
// import Task from "../Models/taskModel.js";
// import Notification from "../Models/Notification.js";

// const checkOverdueTasks = schedule.scheduleJob('* * * * *', async () => {
//   try {
//     const now = new Date();

//     await Task.updateMany(
//       { dueDate: { $lt: now }, status: 'pending' },
//       { status: 'overdue' }
//     );
//   } catch (error) {
//     console.error('Error checking overdue tasks:', error);
//   }
// });





// const dueDateNotification = schedule.scheduleJob("0 * * * *", async () => {
//     console.log('Running overdue due date check...');
//     try {
//         const now = new Date();
//         const upcomingPeriod = 24 * 60 * 60 * 1000; 
//         const thresholdTime = new Date(now.getTime() + upcomingPeriod);
    
//         const tasks = await Task.find({
//           dueDate: { $gte: now, $lte: thresholdTime },
//           status: "pending", 
//         });
    
//         for (const task of tasks) {
//           const existingNotification = await Notification.findOne({
//             userId: task.userId,
//             taskId: task._id,
//             type: "Due Date Reminder",
//           });
    
//           if (!existingNotification) {
//             const notification = new Notification({
//               userId: task.userId,
//               taskId: task._id,
//               title: "Task Due Reminder",
//               message: `Your task "${task.title}" is due on ${getDate(task.dueDate)}`,
//               type: "Due Date Reminder",
//               scheduledFor: task.dueDate,
//             });
    
//             await notification.save();
//             console.log(`Notification sent for task "${task.title}"`);
//           }
//         }
//     } catch (err) {
//     console.error("Error sending due task notifications:", err);
//     }
// })

// export default {checkOverdueTasks, dueDateNotification};

