import type { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Tee',
    description: 'A comfortable and stylish classic t-shirt.',
    longDescription: 'Made from 100% premium cotton, this t-shirt offers a soft feel and a comfortable fit. Perfect for everyday wear, it features a ribbed crew neck and short sleeves. Available in multiple colors and sizes.',
    images: ['https://picsum.photos/seed/classictee1/600/600', 'https://picsum.photos/seed/classictee2/600/600', 'https://picsum.photos/seed/classictee3/600/600'],
    price: 25.99,
    category: 'Apparel',
    rating: 4.5,
    reviews: 120,
    stock: 100,
    tags: ['t-shirt', 'cotton', 'casual'],
    variants: [
      {
        type: 'Size',
        options: [
          { id: 's1', value: 'S' },
          { id: 's2', value: 'M' },
          { id: 's3', value: 'L' },
          { id: 's4', value: 'XL' },
        ],
      },
      {
        type: 'Color',
        options: [
          { id: 'c1', value: 'Black' },
          { id: 'c2', value: 'White' },
          { id: 'c3', value: 'Navy', additionalPrice: 2.00 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    description: 'High-fidelity wireless headphones with noise cancellation.',
    longDescription: 'Experience immersive sound with these Bluetooth headphones. Featuring active noise cancellation, a 20-hour battery life, and plush earcups for maximum comfort. Includes a carrying case and charging cable.',
    images: ['https://picsum.photos/seed/headphones1/600/600', 'https://picsum.photos/seed/headphones2/600/600'],
    price: 149.50,
    category: 'Electronics',
    rating: 4.8,
    reviews: 250,
    stock: 50,
    tags: ['audio', 'bluetooth', 'noise-cancelling'],
    variants: [
       {
        type: 'Color',
        options: [
          { id: 'hc1', value: 'Matte Black' },
          { id: 'hc2', value: 'Silver' },
        ],
      },
    ]
  },
  {
    id: '3',
    name: 'Leather Wallet',
    description: 'A slim and durable leather wallet.',
    longDescription: 'Crafted from genuine full-grain leather, this minimalist wallet is designed for both style and functionality. It features multiple card slots, a cash compartment, and RFID-blocking technology to protect your information.',
    images: ['https://picsum.photos/seed/wallet1/600/600'],
    price: 45.00,
    category: 'Accessories',
    rating: 4.2,
    reviews: 85,
    stock: 75,
    tags: ['wallet', 'leather', 'minimalist', 'rfid'],
  },
  {
    id: '4',
    name: 'Yoga Mat',
    description: 'Eco-friendly non-slip yoga mat.',
    longDescription: 'This premium yoga mat is made from eco-friendly, non-toxic materials. Its textured surface provides excellent grip and cushioning for your yoga practice. Lightweight and easy to carry with the included strap.',
    images: ['https://picsum.photos/seed/yogamat1/600/600', 'https://picsum.photos/seed/yogamat2/600/600'],
    price: 39.99,
    category: 'Sports',
    rating: 4.9,
    reviews: 150,
    stock: 60,
    tags: ['yoga', 'fitness', 'eco-friendly'],
     variants: [
      {
        type: 'Color',
        options: [
          { id: 'ymc1', value: 'Teal' },
          { id: 'ymc2', value: 'Purple' },
          { id: 'ymc3', value: 'Gray' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Coffee Maker',
    description: 'Programmable drip coffee maker.',
    longDescription: 'Brew your perfect cup of coffee with this 12-cup programmable coffee maker. Features a brew-pause function, permanent filter, and a keep-warm plate. Easy to use and clean.',
    images: ['https://picsum.photos/seed/coffeemaker1/600/600'],
    price: 79.95,
    category: 'Home Goods',
    rating: 4.6,
    reviews: 95,
    stock: 30,
    tags: ['coffee', 'kitchen', 'appliance'],
  },
  {
    id: '6',
    name: 'Running Shoes',
    description: 'Lightweight and responsive running shoes.',
    longDescription: 'Engineered for comfort and performance, these running shoes feature a breathable mesh upper, cushioned midsole, and durable outsole for excellent traction. Ideal for road running and daily training.',
    images: ['https://picsum.photos/seed/runningshoes1/600/600', 'https://picsum.photos/seed/runningshoes2/600/600', 'https://picsum.photos/seed/runningshoes3/600/600'],
    price: 120.00,
    category: 'Footwear',
    rating: 4.7,
    reviews: 180,
    stock: 80,
    tags: ['sports', 'running', 'athletic'],
    variants: [
      {
        type: 'Size',
        options: [
          { id: 'rs1', value: '8' },
          { id: 'rs2', value: '9' },
          { id: 'rs3', value: '10' },
          { id: 'rs4', value: '11' },
        ],
      },
      {
        type: 'Color',
        options: [
          { id: 'rsc1', value: 'Blue/Orange' },
          { id: 'rsc2', value: 'Black/White' },
        ],
      },
    ],
  },
   {
    id: '7',
    name: 'Smart Watch',
    description: 'Feature-rich smart watch with fitness tracking.',
    longDescription: 'Stay connected and track your fitness goals with this sleek smartwatch. Monitors heart rate, sleep, steps, and more. Receive notifications, control music, and customize watch faces. Water-resistant and long battery life.',
    images: ['https://picsum.photos/seed/smartwatch1/600/600', 'https://picsum.photos/seed/smartwatch2/600/600'],
    price: 199.99,
    category: 'Electronics',
    rating: 4.4,
    reviews: 210,
    stock: 40,
    tags: ['wearable', 'fitness', 'tech'],
    variants: [
      {
        type: 'Band Color',
        options: [
          { id: 'swbc1', value: 'Black Silicone' },
          { id: 'swbc2', value: 'Rose Gold Metal' , additionalPrice: 20},
          { id: 'swbc3', value: 'Forest Green Fabric'},
        ],
      },
    ],
  },
  {
    id: '8',
    name: 'Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness.',
    longDescription: 'Illuminate your workspace with this stylish and functional LED desk lamp. Offers multiple brightness levels and color temperatures to suit your needs. Features a flexible gooseneck and a USB charging port.',
    images: ['https://picsum.photos/seed/desklamp1/600/600'],
    price: 34.99,
    category: 'Home Goods',
    rating: 4.3,
    reviews: 70,
    stock: 90,
    tags: ['lighting', 'office', 'led'],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getAllCategories = (): string[] => {
  const categories = new Set(mockProducts.map(p => p.category));
  return Array.from(categories);
};

export const getPriceRange = (): { min: number, max: number } => {
  if (mockProducts.length === 0) return { min: 0, max: 0 };
  const prices = mockProducts.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
