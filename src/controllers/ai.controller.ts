import axios from "axios";
import type { Request, Response } from "express";
import prisma from "../clients/prismaClient.js";
import { z } from "zod";

const streamPromptSchema = z.object({
  prompt: z.string().min(1).max(10000),
});

const createFlowSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(10000, "Prompt too long"),
  response: z
    .string()
    .min(1, "Response is required")
    .max(50000, "Response too long"),
});

export const askAiStreamController = async (req: Request, res: Response) => {
  try {
    const validated = streamPromptSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid prompt",
      });
    }

    const { prompt } = validated.data;

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "http://localhost:5173",
    });

    const { data: stream } = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        models: ["nvidia/nemotron-nano-9b-v2:free"],
        messages: [{ role: "user", content: prompt }],
        stream: true,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AIFlow App",
        },
        responseType: "stream",
      },
    );

    let fullResponse = "";

    stream.on("data", (chunk: any) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          if (dataStr === "[DONE]") {
            res.write(
              `data: ${JSON.stringify({ done: true, content: fullResponse })}\n\n`,
            );
            res.end();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              // Send chunk to frontend LIVE
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Skip malformed lines
          }
        }
      }
    });

    stream.on("end", () => {
      res.end();
    });

    stream.on("error", (err: any) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });
  } catch (error: any) {
    console.error("Error in AI stream: ", error?.message);
    return res.status(500).json({ message: error?.message });
  }
};

export const saveToDBController = async (req: Request, res: Response) => {
  try {
    const validatedData = createFlowSchema.parse(req.body);

    const flow = await prisma.aiFlow.create({
      data: validatedData,
      select: {
        id: true,
        prompt: true,
        response: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: flow,
      message: "Flow saved successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export const historyController = async (req: Request, res: Response) => {
  try {
    const flow = await prisma.aiFlow.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(201).json({
      success: true,
      data: flow,
      message: "Prompt fetched successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};
