import { Router } from "express";
import { detectReorderCandidates, runShoppingAssistant } from "../lib/gemini";

export const agentRouter = Router();

agentRouter.post("/chat", async (req, res) => {
  try {
    const message = String(req.body?.message ?? "").trim();
    const profileId = String(req.body?.profileId ?? "guest");
    const userName = req.body?.userName ? String(req.body.userName) : undefined;
    const history = Array.isArray(req.body?.history)
      ? req.body.history
          .filter((h: any) => h?.role && h?.text)
          .slice(-10)
          .map((h: any) => ({ role: h.role === "assistant" ? "assistant" : "user", text: String(h.text) }))
      : [];

    if (!message) return res.status(400).json({ error: "Message is required" });

    const result = await runShoppingAssistant(message, profileId, history, userName);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Assistant unavailable" });
  }
});

agentRouter.get("/reorder-suggestions/:profileId", (req, res) => {
  try {
    const suggestions = detectReorderCandidates(req.params.profileId);
    res.json({ suggestions });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Could not load suggestions" });
  }
});
