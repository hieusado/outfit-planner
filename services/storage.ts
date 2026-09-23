export type OutfitCategory = 'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessories';

export type Item = {
  id: string;
  name: string;
  category: OutfitCategory;
  color: string;
};

export type Outfit = {
  id: string;
  name: string;
  items: Item[];
  dateWorn: string;
  weatherNote: string;
  createdAt: string;
};

export const itemCatalog: Item[] = [
  { id: 'item-1', name: 'Classic Tee', category: 'Top', color: 'beige' },
  { id: 'item-2', name: 'Denim Jeans', category: 'Bottom', color: 'blue' },
  { id: 'item-3', name: 'White Sneakers', category: 'Shoes', color: 'white' },
  { id: 'item-4', name: 'Light Hoodie', category: 'Top', color: 'grey' },
  { id: 'item-5', name: 'Corduroy Jacket', category: 'Outerwear', color: 'olive' },
  { id: 'item-6', name: 'Scarf', category: 'Accessories', color: 'navy' },
  { id: 'item-7', name: 'Leather Tote', category: 'Accessories', color: 'black' },
  { id: 'item-8', name: 'Chino Trousers', category: 'Bottom', color: 'khaki' },
];

export async function fetchOutfits(): Promise<Outfit[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: 'outfit-1',
      name: 'City casual',
      items: [itemCatalog[0], itemCatalog[1], itemCatalog[2]],
      dateWorn: new Date().toISOString().slice(0, 10),
      weatherNote: 'Mild temperature with a light breeze.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'outfit-2',
      name: 'Rain-ready layer',
      items: [itemCatalog[3], itemCatalog[5], itemCatalog[4]],
      dateWorn: '2026-09-15',
      weatherNote: 'Cool air with a chance of wind and drizzle.',
      createdAt: '2026-09-15T09:00:00.000Z',
    },
    {
      id: 'outfit-3',
      name: 'Weekend smart set',
      items: [itemCatalog[7], itemCatalog[0], itemCatalog[6]],
      dateWorn: '2026-09-10',
      weatherNote: 'Sunny, dry, and comfortable for long walks.',
      createdAt: '2026-09-10T12:30:00.000Z',
    },
  ];
}
