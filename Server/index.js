import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/connectDb.js';
import authRoutes from './Routes/authRoutes.js';
import blogRoutes from './Routes/blogRoutes.js';
import commentRoutes from './Routes/comments.js';
import notificationRoutes from "./Routes/notificationRoutes.js";
import {Server} from "socket.io";
import http from "http";

dotenv.config();

const port = process.env.PORT || 5000;

// Connect to the database
await connectDB();

const app = express();

const server = http.createServer(app);

// Middleware
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

// CORS Configuration
const whitelist = [
  'http://localhost:3000',
  'https://your-production-domain.com',
  "http://172.20.10.3:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS for Socket.IO: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("disconnet", () => {
    console.log("User disconnected: ", socket.id);
  })
})

app.set("socketio", io);


// Routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Jobs
// Ensure the scheduled job runs
// checkOverdueTasks;
// dueDateNotification;

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));