import { kobeImage } from "../assets/images";

const mockProducts = [
  {
    id: 1,
    name: "1:1 Chrome Hearts + CDG",
    description:
      "Sign length 2.5ft, Puddle length 2ft, Free Shipping Included",
    price: 89.99,
    imageUrls: [
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/4a07965364b3b0fbf93a7c5f7ea9de1d82dd27a1/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/4a07965364b3b0fbf93a7c5f7ea9de1d82dd27a1/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/f1dabcff9d9e585a9715772326e5c15ee38c8549/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/6540a20608f1cb270d21f999d3d47c403c338ea5/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/046999befaf63b986c9ba2d490f438a75f3920ae/original.jpeg",
      // "https://items-images-production.s3.us-west-2.amazonaws.com/files/4a07965364b3b0fbf93a7c5f7ea9de1d82dd27a1/original.jpeg",
      // "https://items-images-production.s3.us-west-2.amazonaws.com/files/4a07965364b3b0fbf93a7c5f7ea9de1d82dd27a1/original.jpeg",
    ],
    inventoryCount: 7,
    v_ids: [
      "BJXELHH7N6Q4GOGR6VGA4A7C",
      "3JTGVOFNLY4BEBHFADNW2AJ6",
      "MGHMDGCDE3CSYA533PI5NTLU",
      "3JTGVOFNLY4BEBHFADNW2AJ6",
      "MGHMDGCDE3CSYA533PI5NTLU",
      "3JTGVOFNLY4BEBHFADNW2AJ6",
      "MGHMDGCDE3CSYA533PI5NTLU",
    ],
    v_names: ["Black", "Purple", "Grey", "White", "Red", "Blue", "Green"],
    v_quantities: [1, 3, 3, 1, 1, 1, 1],
  },
  {
    id: 7,
    name: "Chrome Hearts + CDG",
    description: "No description available",
    price: 89.99,
    imageUrls: [
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/4a07965364b3b0fbf93a7c5f7ea9de1d82dd27a1/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/f1dabcff9d9e585a9715772326e5c15ee38c8549/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/6540a20608f1cb270d21f999d3d47c403c338ea5/original.jpeg",
      "https://items-images-production.s3.us-west-2.amazonaws.com/files/046999befaf63b986c9ba2d490f438a75f3920ae/original.jpeg",
    ],
    inventoryCount: 7,
    v_ids: ["BJXELHH7N6Q4GOGR6VGA4A7C"],
    v_names: ["Black"],
    v_quantities: [1],
  },
  {
    id: 2,
    name: "Elegant Persian Rug",
    description:
      "A beautiful handwoven Persian rug that adds elegance to any room.",
    price: 299.99,
    imageUrls: [kobeImage],
    inventoryCount: 10,
    v_names: ["Black", "Purple", "Grey", "White", "Red", "Blue", "Green"],
    v_quantities: [1, 3, 3, 1, 1, 1, 1],
  },
  {
    id: 3,
    name: "1:1 Modern Geometric Rug",
    description: "A stylish geometric rug perfect for contemporary spaces.",
    price: 199.99,
    imageUrls: [kobeImage],
    inventoryCount: 5,
  },
  {
    id: 4,
    name: "Classic Vintage Rug",
    description:
      "A vintage rug with intricate patterns, ideal for traditional decor.",
    price: 349.99,
    imageUrls: [kobeImage],
    inventoryCount: 0,
  },
];

export default mockProducts;
