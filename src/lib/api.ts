import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback dummy data jika API gagal
    return [
      {
        id: 1,
        title: "Sample Product 1",
        price: 19.99,
        description: "This is a sample product description",
        category: "electronics",
        image: "https://via.placeholder.com/300x300",
        rating: { rate: 4.5, count: 120 }
      },
      {
        id: 2,
        title: "Sample Product 2", 
        price: 29.99,
        description: "Another sample product description",
        category: "clothing",
        image: "https://via.placeholder.com/300x300",
        rating: { rate: 4.2, count: 85 }
      }
    ];
  }
}