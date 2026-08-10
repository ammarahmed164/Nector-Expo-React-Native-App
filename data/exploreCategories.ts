export type ExploreCategory = {
  id: string;
  name: string;
  image: string;
  bg: string;
  border: string;
};

export const exploreCategories: ExploreCategory[] = [
  {
    id: "fresh-fruits-vegetable",
    name: "Frash Fruits & Vegetable",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400",
    bg: "#FEFAF5",
    border: "#F8A44C",
  },
  {
    id: "cooking-oil",
    name: "Cooking Oil & Ghee",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    bg: "#FFFCF5",
    border: "#F8A44C",
  },
  {
    id: "meat-fish",
    name: "Meat & Fish",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400",
    bg: "#FFF5F5",
    border: "#F53E3E",
  },
  {
    id: "bakery-snacks",
    name: "Bakery & Snacks",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    bg: "#FCF4FB",
    border: "#D3B0E0",
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400",
    bg: "#FFF8E5",
    border: "#F8A44C",
  },
  {
    id: "beverages",
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    bg: "#F8F8FD",
    border: "#B7DFF5",
  },
];
