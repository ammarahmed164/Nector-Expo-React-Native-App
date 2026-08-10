import { Router } from "express";
import { supabase } from "../lib/supabase";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from("products").select("*").order("createdAt", { ascending: false });

    if (category) query = query.eq("category", String(category));
    if (search) query = query.ilike("name", `%${String(search)}%`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ?? []);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Failed to fetch products" });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", req.params.id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Failed to fetch product" });
  }
});
