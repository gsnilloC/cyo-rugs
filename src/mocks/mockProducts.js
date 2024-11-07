import { phantomImage, offWhiteImage, lebronImage } from "../assets/images";

const mockProducts = [
  {
    id: 1,
    name: "Elegant Persian Rug",
    description: "A beautiful handwoven Persian rug that adds elegance to any room.",
    price: 299.99,
    imageUrls: [phantomImage],
  },
  {
    id: 2,
    name: "Modern Geometric Rug",
    description: "A stylish geometric rug perfect for contemporary spaces.",
    price: 199.99,
    imageUrls: [offWhiteImage],
  },
  {
    id: 3,
    name: "Classic Vintage Rug",
    description: "A vintage rug with intricate patterns, ideal for traditional decor.",
    price: 349.99,
    imageUrls: [lebronImage],
  },
];

export default mockProducts;
