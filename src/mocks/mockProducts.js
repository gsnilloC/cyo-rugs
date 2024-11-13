import { kobeImage, troupe } from "../assets/images";

const mockProducts = [
  {
    id: 1,
    name: "Elegant Persian Rug",
    description:
      "A beautiful handwoven Persian rug that adds elegance to any room.",
    price: 299.99,
    imageUrls: [kobeImage],
    inventoryCount: 10,
  },
  {
    id: 2,
    name: "Modern Geometric Rug",
    description: "A stylish geometric rug perfect for contemporary spaces.",
    price: 199.99,
    imageUrls: [troupe],
    inventoryCount: 5,
  },
  {
    id: 3,
    name: "Classic Vintage Rug",
    description:
      "A vintage rug with intricate patterns, ideal for traditional decor.",
    price: 349.99,
    imageUrls: [kobeImage],
    inventoryCount: 0,
  },
];

export default mockProducts;
