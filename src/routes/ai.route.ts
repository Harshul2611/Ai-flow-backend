import { Router } from "express";
import {
  askAiStreamController,
  historyController,
  saveToDBController,
} from "../controllers/ai.controller.js";

const aiRouter = Router();

aiRouter.post("/ask-ai-stream", askAiStreamController);
aiRouter.post("/save", saveToDBController);
aiRouter.get("/history", historyController);

export default aiRouter;
