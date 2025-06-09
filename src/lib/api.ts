import { Product, ProductsResponse } from '@/types';

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=0');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: ProductsResponse = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback dummy data jika API gagal
    return [
      {
        id: 1,
        title: "Sample Smartphone",
        description: "A high-quality smartphone with excellent features",
        price: 599.99,
        discountPercentage: 10.5,
        rating: 4.5,
        stock: 50,
        brand: "SampleBrand",
        category: "smartphones",
        thumbnail: "https://via.placeholder.com/300x300",
        images: ["https://via.placeholder.com/300x300"]
      },
      {
        id: 2,
        title: "Sample Laptop",
        description: "A powerful laptop for work and gaming",
        price: 1299.99,
        discountPercentage: 15.0,
        rating: 4.8,
        stock: 25,
        brand: "SampleBrand",
        category: "laptops",
        thumbnail: "https://via.placeholder.com/300x300",
        images: ["https://via.placeholder.com/300x300"]
      }
    ];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data: ProductsResponse = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error searching products:', error);
    // Fallback to empty results if search fails
    return [];
  }
}