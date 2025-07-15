export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  aiHint: string;
  concerns: string[];
};

export const products: Product[] = [
  {
    id: "prod_01",
    name: "HydraBoost Gel",
    description: "Lightweight gel for intense hydration without the greasy feel. Perfect for dry and dehydrated skin.",
    price: "$28.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "skincare bottle",
    concerns: ["dryness"],
  },
  {
    id: "prod_02",
    name: "MatteFinish Moisturizer",
    description: "Controls excess oil and shine for a smooth, matte look. Ideal for oily skin types.",
    price: "$32.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "face cream",
    concerns: ["oiliness"],
  },
  {
    id: "prod_03",
    name: "ClearPore Serum",
    description: "A potent serum with salicylic acid to target acne, unclog pores, and reduce inflammation.",
    price: "$45.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "serum bottle",
    concerns: ["acne"],
  },
  {
    id: "prod_04",
    name: "AgeDefy Cream",
    description: "Rich in retinoids and peptides to combat fine lines, wrinkles, and improve skin elasticity.",
    price: "$65.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "luxury skincare",
    concerns: ["wrinkles"],
  },
  {
    id: "prod_05",
    name: "SunShield SPF 50",
    description: "Broad-spectrum protection against UVA/UVB rays to prevent sun damage and premature aging.",
    price: "$25.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "sunscreen tube",
    concerns: ["sun-damage", "wrinkles"],
  },
  {
    id: "prod_06",
    name: "Soothe & Calm Elixir",
    description: "A gentle formula to reduce redness and calm irritated skin, suitable for sensitive types.",
    price: "$38.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "calming serum",
    concerns: ["redness"],
  },
  {
    id: "prod_07",
    name: "BrightenUp Essence",
    description: "Fades dark spots and evens out skin tone with Vitamin C and niacinamide.",
    price: "$52.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "brightening essence",
    concerns: ["dark-spots", "sun-damage"],
  },
  {
    id: "prod_08",
    name: "AquaRestore Cleanser",
    description: "A hydrating cleanser that removes impurities without stripping the skin's natural moisture.",
    price: "$22.00",
    image: "https://placehold.co/400x400.png",
    aiHint: "face cleanser",
    concerns: ["dryness", "oiliness"],
  },
];
