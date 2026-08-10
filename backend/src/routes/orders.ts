import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  profileId: z.string(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().min(1) })),
  fulfillmentType: z.enum(["delivery", "pickup"]),
  deliverySlot: z.string().optional(),
  pickupTime: z.string().optional(),
  paymentMethod: z.enum(["stripe", "jazzcash", "easypaisa", "cash"]),
});

ordersRouter.post("/", async (req, res) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { profileId, items, fulfillmentType, deliverySlot, pickupTime, paymentMethod } = parsed.data;
    const productIds = items.map((i) => i.productId);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (productsError) return res.status(500).json({ error: productsError.message });

    const totalAmount = items.reduce((sum, item) => {
      const product = products?.find((p) => p.id === item.productId);
      return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    const orderId = crypto.randomUUID();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        profileId,
        fulfillmentType,
        deliverySlot: deliverySlot ?? null,
        pickupTime: pickupTime ?? null,
        totalAmount,
        paymentMethod,
        status: "pending",
      })
      .select("*")
      .single();

    if (orderError) return res.status(500).json({ error: orderError.message });

    const orderItems = items.map((item) => {
      const product = products!.find((p) => p.id === item.productId)!;
      return {
        id: crypto.randomUUID(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) return res.status(500).json({ error: itemsError.message });

    res.json({ order: { ...order, items: orderItems } });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Failed to create order" });
  }
});

ordersRouter.get("/:id", async (req, res) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (orderError) return res.status(500).json({ error: orderError.message });
    if (!order) return res.status(404).json({ error: "Not found" });

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(*)")
      .eq("orderId", req.params.id);

    if (itemsError) return res.status(500).json({ error: itemsError.message });

    res.json({ ...order, items: items ?? [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Failed to fetch order" });
  }
});
