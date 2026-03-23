import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRouter from "./routes/ai.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", aiRouter);

export default app;
