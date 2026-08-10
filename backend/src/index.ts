import "dotenv/config";
import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { authRouter } from "./routes/auth";
import { agentRouter } from "./routes/agent";
import { adminRouter, appRouter } from "./routes/admin";
import { supabase } from "./lib/supabase";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "ok", service: "nectar-backend" }));

app.get("/health", async (_req, res) => {
  const { error } = await supabase.from("products").select("id").limit(1);
  if (error) return res.status(503).json({ status: "degraded", database: error.message });
  res.json({ status: "ok", database: "connected" });
});

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);
app.use("/agent", agentRouter);
app.use("/app", appRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => console.log(`Nectar backend running on port ${PORT}`));
