import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/studentRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: "32kb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Campus Placement Backend Running...");
});

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  await connectDB();
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`Backend listening on port ${port}`));
}

startServer().catch((error) => {
  console.error("Backend startup failed:", error);
  process.exitCode = 1;
});
