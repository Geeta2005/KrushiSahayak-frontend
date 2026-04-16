export interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  owner: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  availability: string;
}

export const categories = [
  "All Equipment",
  "Tractors",
  "Harvesters",
  "Plows",
  "Seeders",
  "Irrigation",
];

export const equipmentData: Equipment[] = [
  {
    id: "1",
    name: "John Deere 5075E Tractor",
    category: "Tractors",
    description: "Versatile utility tractor with 75 HP engine, perfect for medium-sized farming operations. Features comfortable cab, efficient fuel consumption, and reliable performance.",
    pricePerDay: 150,
    location: "Iowa, USA",
    owner: "Green Valley Farms",
    image: "https://images.unsplash.com/photo-1763101005003-3690b15960d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwNzE2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 24,
    features: [
      "75 HP engine",
      "4WD capability",
      "Air-conditioned cab",
      "Hydraulic system",
      "PTO available"
    ],
    availability: "Available"
  },
  {
    id: "2",
    name: "Case IH Axial-Flow 9250 Combine",
    category: "Harvesters",
    description: "High-capacity combine harvester ideal for large-scale grain harvesting. Equipped with advanced threshing technology and grain tank capacity of 400 bushels.",
    pricePerDay: 450,
    location: "Nebraska, USA",
    owner: "Harvest Pro Equipment",
    image: "https://images.unsplash.com/photo-1630174523471-d278fc36a93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJ2ZXN0ZXIlMjBjb21iaW5lJTIwbWFjaGluZXxlbnwxfHx8fDE3NzYwOTczMTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 18,
    features: [
      "400 bushel grain tank",
      "GPS guidance system",
      "Yield monitoring",
      "Auto header control",
      "Climate controlled cab"
    ],
    availability: "Available"
  },
  {
    id: "3",
    name: "Heavy Duty Moldboard Plow",
    category: "Plows",
    description: "Robust moldboard plow designed for deep tillage and soil preparation. Perfect for turning over soil and burying crop residue.",
    pricePerDay: 80,
    location: "Kansas, USA",
    owner: "Prairie Equipment Co.",
    image: "https://images.unsplash.com/photo-1774365294442-966e84c95bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbG93JTIwYWdyaWN1bHR1cmFsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3NjA5NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 15,
    features: [
      "5-bottom configuration",
      "Auto-reset system",
      "Hardened steel blades",
      "Depth adjustment",
      "Heavy-duty frame"
    ],
    availability: "Available"
  },
  {
    id: "4",
    name: "Precision Seed Planter",
    category: "Seeders",
    description: "Advanced precision planter with GPS-controlled seed placement for optimal crop spacing and improved yields.",
    pricePerDay: 120,
    location: "Illinois, USA",
    owner: "Modern Agri Solutions",
    image: "https://images.unsplash.com/photo-1757932462698-ad973b16b1ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkZXIlMjBwbGFudGluZyUyMG1hY2hpbmV8ZW58MXx8fHwxNzc2MDk3MzEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 12,
    features: [
      "12-row capacity",
      "GPS integration",
      "Variable rate seeding",
      "Liquid fertilizer system",
      "Seed monitoring"
    ],
    availability: "Available"
  },
  {
    id: "5",
    name: "Center Pivot Irrigation System",
    category: "Irrigation",
    description: "Efficient center pivot irrigation system covering up to 160 acres. Features automated controls and water-saving technology.",
    pricePerDay: 200,
    location: "Colorado, USA",
    owner: "Water Smart Farming",
    image: "https://images.unsplash.com/photo-1743742566156-f1745850281a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcnJpZ2F0aW9uJTIwc3ByaW5rbGVyJTIwc3lzdGVtfGVufDF8fHx8MTc3NjA5NzMxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 9,
    features: [
      "160 acre coverage",
      "Remote monitoring",
      "Low pressure sprinklers",
      "Auto-start/stop",
      "Weather sensors"
    ],
    availability: "Available"
  },
  {
    id: "6",
    name: "Kubota M7-172 Tractor",
    category: "Tractors",
    description: "Powerful 170 HP tractor with exceptional fuel efficiency and modern comfort features. Ideal for heavy-duty farming tasks.",
    pricePerDay: 180,
    location: "Texas, USA",
    owner: "Lone Star Equipment",
    image: "https://images.unsplash.com/photo-1763101005003-3690b15960d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwNzE2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 31,
    features: [
      "170 HP engine",
      "CVT transmission",
      "Premium cab comfort",
      "Advanced hydraulics",
      "Bluetooth connectivity"
    ],
    availability: "Rented"
  },
];
