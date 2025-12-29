import express from "express";
import cors from "cors";
import dotenv  from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js";
import uploadRoute from "./routes/upload.routes.js"
import instructorRoute from "./routes/instructor.routes.js"
import updateRoute from "./routes/update.routes.js";
import learnerRoutes from "./routes/learner.routes.js";
import reviewRouter from './routes/reviews.routes.js'

const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true,               // Required to allow cookies/refresh tokens
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/instructor", uploadRoute);
app.use("/api/instructor",instructorRoute);
app.use('/api/instructor',updateRoute)
app.use("/api/learner", learnerRoutes);
app.use('/api/review',reviewRouter)

export default app;
