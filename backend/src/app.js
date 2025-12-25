import express from "express";
import cors from "cors";
import dotenv  from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js";
import uploadRoute from "./routes/upload.routes.js"
import instructorRoute from "./routes/instructor.routes.js"
import updateRouter from "./routes/update.routes.js";
import learnerRoutes from "./routes/learner.routes.js";

const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5174', // EXACT URL of your frontend
  credentials: true,               // Required to allow cookies/refresh tokens
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/instructor",instructorRoute);
app.use('/api/update',updateRouter)
app.use("/api/learner", learnerRoutes);

export default app;
