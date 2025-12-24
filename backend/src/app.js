import express from "express";
import cors from "cors";
import dotenv  from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import uploadRoute from "./routes/upload.routes.js"
import instructorRoute from "./routes/instructor.routes.js"

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/instructor",instructorRoute);

export default app;
