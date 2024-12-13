import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  title: {
    type: String,
    required: true, 
  },
  message: {
    type: String,
    required: true, 
  },
  isRead: {
    type: Boolean,
    default: false, 
  },
  sentAt: {
    type: Date,
    default: Date.now, 
  },
});

export default model("Notification", NotificationSchema);