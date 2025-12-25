import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js";

const app = express();

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

export default app;
