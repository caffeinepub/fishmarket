// Sample product images mapped by product name keywords
const productImageMap: Record<string, string> = {
  salmon: "/assets/generated/product-salmon.dim_600x400.jpg",
  prawn: "/assets/generated/product-prawns.dim_600x400.jpg",
  shrimp: "/assets/generated/product-prawns.dim_600x400.jpg",
  "sea bass": "/assets/generated/product-seabass.dim_600x400.jpg",
  seabass: "/assets/generated/product-seabass.dim_600x400.jpg",
  bass: "/assets/generated/product-seabass.dim_600x400.jpg",
  tuna: "/assets/generated/product-tuna.dim_600x400.jpg",
  oyster: "/assets/generated/product-oysters.dim_600x400.jpg",
  cod: "/assets/generated/product-cod.dim_600x400.jpg",
};

export function getProductImage(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [key, img] of Object.entries(productImageMap)) {
    if (lower.includes(key)) return img;
  }
  // Cycle through available images as fallback
  const images = Object.values(productImageMap);
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    hash = (hash * 31 + productName.charCodeAt(i)) & 0xffffffff;
  }
  return images[Math.abs(hash) % images.length];
}

// Sample products for display before backend loads
export const SAMPLE_PRODUCTS = [
  {
    id: BigInt(1),
    name: "Atlantic Salmon Fillet",
    category: "Fish",
    description:
      "Premium fresh Atlantic salmon, rich in omega-3 fatty acids. Perfect for grilling, pan-frying, or baking. Sourced from sustainable farms.",
    priceInCents: BigInt(1899),
    weightGrams: BigInt(500),
    unit: "fillet",
    stockQty: BigInt(25),
    available: true,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: BigInt(2),
    name: "Tiger Prawns",
    category: "Shellfish",
    description:
      "Jumbo tiger prawns, wild-caught and sustainably sourced. Great for stir-fries, curries, and BBQ. Shell-on for maximum flavour.",
    priceInCents: BigInt(2499),
    weightGrams: BigInt(400),
    unit: "pack",
    stockQty: BigInt(18),
    available: true,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: BigInt(3),
    name: "Whole Sea Bass",
    category: "Fish",
    description:
      "Fresh Mediterranean sea bass, whole and cleaned. Delicately flavoured white fish ideal for whole roasting with herbs and lemon.",
    priceInCents: BigInt(1599),
    weightGrams: BigInt(600),
    unit: "whole",
    stockQty: BigInt(12),
    available: true,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: BigInt(4),
    name: "Yellowfin Tuna Steak",
    category: "Fish",
    description:
      "Premium sushi-grade yellowfin tuna steak. Meaty texture with mild flavour, perfect for searing or raw preparations.",
    priceInCents: BigInt(2999),
    weightGrams: BigInt(250),
    unit: "steak",
    stockQty: BigInt(8),
    available: true,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: BigInt(5),
    name: "Fresh Oysters",
    category: "Shellfish",
    description:
      "Live Pacific oysters, harvested daily from pristine waters. Briny and creamy with a clean ocean finish. Sold by the dozen.",
    priceInCents: BigInt(2199),
    weightGrams: BigInt(300),
    unit: "dozen",
    stockQty: BigInt(30),
    available: true,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: BigInt(6),
    name: "Atlantic Cod Fillet",
    category: "Fish",
    description:
      "Classic Atlantic cod, sustainably caught. Flaky white flesh with a mild, clean taste. Ideal for fish and chips or baking.",
    priceInCents: BigInt(1299),
    weightGrams: BigInt(450),
    unit: "fillet",
    stockQty: BigInt(20),
    available: true,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
];
