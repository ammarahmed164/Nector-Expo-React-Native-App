import fs from "fs";
import path from "path";
import crypto from "crypto";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
};

export type AppOrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  unit?: string;
};

export type AppOrder = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  items: AppOrderItem[];
  total: number;
  deliveryMethod: string;
  paymentLabel: string;
  promoLabel: string;
  status: "accepted" | "processing" | "delivered" | "cancelled";
  createdAt: string;
};

type Store = {
  users: AppUser[];
  orders: AppOrder[];
};

const DATA_DIR = path.join(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "admin-store.json");

function defaultStore(): Store {
  return { users: [], orders: [] };
}

function readStore(): Store {
  try {
    if (!fs.existsSync(DATA_FILE)) return defaultStore();
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Store;
  } catch {
    return defaultStore();
  }
}

function writeStore(store: Store) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function upsertUser(input: { id: string; name: string; email: string; phone?: string }) {
  const store = readStore();
  const now = new Date().toISOString();
  const idx = store.users.findIndex((u) => u.id === input.id || u.email === input.email);

  if (idx >= 0) {
    store.users[idx] = {
      ...store.users[idx],
      name: input.name,
      email: input.email,
      phone: input.phone ?? store.users[idx].phone,
      updatedAt: now,
    };
  } else {
    store.users.unshift({
      id: input.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      createdAt: now,
      updatedAt: now,
      orderCount: 0,
    });
  }

  writeStore(store);
  return store.users.find((u) => u.id === input.id)!;
}

export function addOrder(input: Omit<AppOrder, "createdAt" | "status"> & { status?: AppOrder["status"] }) {
  const store = readStore();
  const order: AppOrder = {
    ...input,
    status: input.status ?? "accepted",
    createdAt: new Date().toISOString(),
  };
  store.orders.unshift(order);

  const userIdx = store.users.findIndex((u) => u.id === input.userId);
  if (userIdx >= 0) {
    store.users[userIdx].orderCount += 1;
    store.users[userIdx].updatedAt = order.createdAt;
  }

  writeStore(store);
  return order;
}

export function listUsers() {
  return readStore().users.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listOrders() {
  return readStore().orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDashboardStats() {
  const store = readStore();
  const today = new Date().toISOString().slice(0, 10);
  const ordersToday = store.orders.filter((o) => o.createdAt.startsWith(today));
  const revenue = store.orders.reduce((s, o) => s + o.total, 0);
  const revenueToday = ordersToday.reduce((s, o) => s + o.total, 0);

  return {
    totalUsers: store.users.length,
    totalOrders: store.orders.length,
    ordersToday: ordersToday.length,
    revenue,
    revenueToday,
    pendingOrders: store.orders.filter((o) => o.status === "accepted" || o.status === "processing").length,
  };
}

export function updateOrderStatus(id: string, status: AppOrder["status"]) {
  const store = readStore();
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  store.orders[idx].status = status;
  writeStore(store);
  return store.orders[idx];
}

/** Simple admin session tokens (in-memory) */
const adminTokens = new Map<string, { email: string; expiresAt: number }>();

export function createAdminToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  adminTokens.set(token, { email, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
  return token;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const session = adminTokens.get(token);
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL ?? "ammarahmed2037@gmail.com").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "ammar123$",
  };
}
