export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  category: string;
  exploreCategory?: string;
  filterCategory?: string;
  brand?: string;
  description?: string;
  rating?: number;
  nutrition?: string;
  tags?: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    unit: "7pcs, Priceg",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    category: "fruits",
    exploreCategory: "fresh-fruits-vegetable",
    rating: 4.5,
    description:
      "Bananas are nutritious, may be good for weight loss, may be good for your heart, as part of a healthful and varied diet.",
    nutrition: "100gr",
    tags: ["exclusive"],
  },
  {
    id: "2",
    name: "Red Apple",
    unit: "1kg, Priceg",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
    category: "fruits",
    exploreCategory: "fresh-fruits-vegetable",
    rating: 4.5,
    description:
      "Apples are nutritious, may be good for weight loss, may be good for your heart, as part of a healthful and varied diet.",
    nutrition: "100gr",
    tags: ["exclusive"],
  },
  {
    id: "3",
    name: "Bell Pepper Red",
    unit: "1kg, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
    category: "vegetables",
    exploreCategory: "fresh-fruits-vegetable",
    rating: 4.3,
    tags: ["bestselling"],
  },
  {
    id: "4",
    name: "Egg Chicken Red",
    unit: "4pcs, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
    category: "dairy-eggs",
    exploreCategory: "dairy-eggs",
    filterCategory: "eggs",
    brand: "kazi-farmas",
    rating: 4.6,
    description: "Fresh farm eggs, rich in protein and perfect for daily cooking.",
    nutrition: "100gr",
  },
  {
    id: "5",
    name: "Ginger",
    unit: "250gm, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400",
    category: "vegetables",
    exploreCategory: "fresh-fruits-vegetable",
    rating: 4.2,
    tags: ["bestselling"],
  },
  {
    id: "6",
    name: "Beef Bone",
    unit: "1kg, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1602470521006-aa16f5a76e94?w=400",
    category: "meat",
    exploreCategory: "meat-fish",
    rating: 4.4,
  },
  {
    id: "7",
    name: "Broiler Chicken",
    unit: "1kg, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400",
    category: "meat",
    exploreCategory: "meat-fish",
    rating: 4.5,
  },
  {
    id: "8",
    name: "Naturel Red Apple",
    unit: "1kg, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400",
    category: "fruits",
    exploreCategory: "fresh-fruits-vegetable",
    rating: 4.7,
    description:
      "Apples Are Nutritious. Apples May Be Good For Weight Loss. Apples May Be Good For Your Heart. As Part Of A Healthful And Varied Diet.",
    nutrition: "100gr",
  },
  {
    id: "9",
    name: "Diet Coke",
    unit: "355ml, Price",
    price: 1.99,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
    category: "beverages",
    exploreCategory: "beverages",
    filterCategory: "fast-food",
    brand: "cocola",
    rating: 4.4,
  },
  {
    id: "10",
    name: "Sprite Can",
    unit: "325ml, Price",
    price: 1.5,
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87ba7a?w=400",
    category: "beverages",
    exploreCategory: "beverages",
    filterCategory: "fast-food",
    brand: "cocola",
    rating: 4.3,
  },
  {
    id: "11",
    name: "Apple & Grape Juice",
    unit: "2L, Price",
    price: 15.5,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
    category: "beverages",
    exploreCategory: "beverages",
    rating: 4.6,
  },
  {
    id: "12",
    name: "Orenge Juice",
    unit: "2L, Price",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
    category: "beverages",
    exploreCategory: "beverages",
    rating: 4.5,
  },
  {
    id: "13",
    name: "Coca Cola Can",
    unit: "325ml, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
    category: "beverages",
    exploreCategory: "beverages",
    filterCategory: "fast-food",
    brand: "cocola",
    rating: 4.2,
  },
  {
    id: "14",
    name: "Pepsi Can",
    unit: "330ml, Price",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1581636625402-29b7762a2fe9?w=400",
    category: "beverages",
    exploreCategory: "beverages",
    filterCategory: "fast-food",
    brand: "cocola",
    rating: 4.1,
  },
  {
    id: "15",
    name: "Egg Chicken White",
    unit: "180g, Price",
    price: 1.5,
    image: "https://images.unsplash.com/photo-1518569659554-75d459ea2941?w=400",
    category: "dairy-eggs",
    exploreCategory: "dairy-eggs",
    filterCategory: "eggs",
    brand: "individual-collection",
    rating: 4.4,
  },
  {
    id: "16",
    name: "Egg Pasta",
    unit: "30gm, Price",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1551892379-ecf875246709?w=400",
    category: "bakery-snacks",
    exploreCategory: "bakery-snacks",
    filterCategory: "noodles-pasta",
    brand: "ifad",
    rating: 4.0,
  },
  {
    id: "17",
    name: "Egg Noodles",
    unit: "2L, Price",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1569718212165-3a2853961473?w=400",
    category: "bakery-snacks",
    exploreCategory: "bakery-snacks",
    filterCategory: "noodles-pasta",
    brand: "ifad",
    rating: 4.2,
  },
  {
    id: "18",
    name: "Mayonnaise Eggless",
    unit: "500ml, Price",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1472476440907-3720d516e2bc?w=400",
    category: "bakery-snacks",
    exploreCategory: "bakery-snacks",
    rating: 4.3,
  },
  {
    id: "19",
    name: "Basmati Rice",
    unit: "5kg, Price",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    category: "rice",
    exploreCategory: "cooking-oil",
    rating: 4.8,
  },
  {
    id: "20",
    name: "Mixed Pulses",
    unit: "1kg, Price",
    price: 6.49,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
    category: "pulses",
    exploreCategory: "cooking-oil",
    rating: 4.6,
  },
  {
    id: "21",
    name: "Sunflower Oil",
    unit: "1L, Price",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    category: "cooking-oil",
    exploreCategory: "cooking-oil",
    rating: 4.5,
  },
  {
    id: "22",
    name: "Fresh Salmon",
    unit: "500g, Price",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
    category: "meat",
    exploreCategory: "meat-fish",
    rating: 4.7,
  },
  {
    id: "23",
    name: "Whole Milk",
    unit: "1L, Price",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    category: "dairy-eggs",
    exploreCategory: "dairy-eggs",
    rating: 4.5,
  },
  {
    id: "24",
    name: "Croissant Pack",
    unit: "6pcs, Price",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    category: "bakery-snacks",
    exploreCategory: "bakery-snacks",
    filterCategory: "chips-crisps",
    brand: "individual-collection",
    rating: 4.4,
  },
];

function resolveFilterCategory(product: Product) {
  if (product.filterCategory) return product.filterCategory;
  const name = product.name.toLowerCase();
  if (name.includes("egg")) return "eggs";
  if (name.includes("noodle") || name.includes("pasta")) return "noodles-pasta";
  if (name.includes("chip") || name.includes("crisp")) return "chips-crisps";
  if (product.category === "beverages") return "fast-food";
  return null;
}

function resolveBrand(product: Product) {
  if (product.brand) return product.brand;
  const name = product.name.toLowerCase();
  if (name.includes("coke") || name.includes("pepsi") || name.includes("sprite")) return "cocola";
  return null;
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function filterProducts(options: {
  query?: string;
  category?: string | null;
  exploreCategory?: string | null;
  filterCategory?: string | null;
  brand?: string | null;
  sort?: string | null;
  tag?: string | null;
  baseList?: Product[];
}) {
  let result = [...(options.baseList ?? products)];
  const q = options.query?.trim().toLowerCase();

  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.unit.toLowerCase().includes(q)
    );
  }

  if (options.category) {
    result = result.filter((p) => p.category === options.category);
  }

  if (options.exploreCategory) {
    result = result.filter((p) => p.exploreCategory === options.exploreCategory);
  }

  if (options.filterCategory) {
    result = result.filter((p) => resolveFilterCategory(p) === options.filterCategory);
  }

  if (options.brand) {
    result = result.filter((p) => resolveBrand(p) === options.brand);
  }

  if (options.tag) {
    result = result.filter((p) => p.tags?.includes(options.tag!));
  }

  switch (options.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "newest":
      result.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    default:
      break;
  }

  return result;
}
