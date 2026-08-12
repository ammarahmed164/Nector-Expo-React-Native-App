import { Router } from "express";
import { z } from "zod";
import {
  addOrder,
  createAdminToken,
  getAdminCredentials,
  getDashboardStats,
  listOrders,
  listUsers,
  updateOrderStatus,
  upsertUser,
  verifyAdminToken,
} from "../lib/adminStore";
import { supabase } from "../lib/supabase";

export const appRouter = Router();

const syncUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

appRouter.post("/users/sync", async (req, res) => {
  const parsed = syncUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid user data" });
  const user = upsertUser(parsed.data);

  const profilePayload = {
    id: parsed.data.id,
    name: parsed.data.name,
    email: parsed.data.email,
    ...(parsed.data.phone !== undefined ? { phone: parsed.data.phone || null } : {}),
  };
  const { error } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "id" });

  if (error) {
    console.warn("Could not sync user profile to Supabase:", error.message);
  }

  res.json({ user, profileSynced: !error });
});

const createOrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  userPhone: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      qty: z.number(),
      price: z.number(),
      unit: z.string().optional(),
    })
  ),
  total: z.number(),
  deliveryMethod: z.string(),
  paymentLabel: z.string(),
  promoLabel: z.string(),
});

appRouter.post("/orders", (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid order data" });
  const order = addOrder(parsed.data);
  res.json({ order });
});

export const adminRouter = Router();

function adminAuth(req: any, res: any, next: any) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyAdminToken(token)) return res.status(401).json({ error: "Unauthorized" });
  next();
}

adminRouter.post("/login", (req, res) => {
  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");
  const creds = getAdminCredentials();
  if (!email || !password || email !== creds.email || password !== creds.password) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }
  const token = createAdminToken(email);
  res.json({ token, admin: { email, name: "Admin" } });
});

adminRouter.get("/dashboard", adminAuth, (_req, res) => {
  res.json(getDashboardStats());
});

adminRouter.get("/users", adminAuth, (_req, res) => {
  res.json({ users: listUsers() });
});

adminRouter.get("/orders", adminAuth, (_req, res) => {
  res.json({ orders: listOrders() });
});

adminRouter.patch("/orders/:id/status", adminAuth, (req, res) => {
  const { status } = req.body ?? {};
  const allowed = ["accepted", "processing", "delivered", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });
  const order = updateOrderStatus(req.params.id, status);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ order });
});
