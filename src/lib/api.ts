import { Product, ProductsResponse } from '@/types';

export async function getProducts(
  page: number = 1, 
  limit: number = 20,
  sortBy?: string,
  order?: 'asc' | 'desc'
): Promise<ProductsResponse> {
  try {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    
    if (sortBy && order) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: ProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback dummy data jika API gagal
    return {
      products: [
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
      ],
      total: 2,
      skip: 0,
      limit: 20
    };
  }
}

export async function getProductsByCategory(
  category: string,
  page: number = 1, 
  limit: number = 20,
  sortBy?: string,
  order?: 'asc' | 'desc'
): Promise<ProductsResponse> {
  try {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    
    if (sortBy && order) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const data: ProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return {
      products: [],
      total: 0,
      skip: 0,
      limit: 20
    };
  }
}

export async function searchProducts(
  query: string, 
  page: number = 1, 
  limit: number = 20,
  sortBy?: string,
  order?: 'asc' | 'desc'
): Promise<ProductsResponse> {
  try {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
    
    if (sortBy && order) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data: ProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    // Fallback to empty results if search fails
    return {
      products: [],
      total: 0,
      skip: 0,
      limit: 20
    };
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    
    // DummyJSON returns categories as array of objects with slug and name
    // We'll use the slug values for API calls
    if (Array.isArray(categories) && categories.length > 0) {
      if (typeof categories[0] === 'object' && categories[0].slug) {
        return categories.map((cat: any) => cat.slug);
      } else if (typeof categories[0] === 'string') {
        return categories;
      }
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback categories
    return [
      'smartphones',
      'laptops',
      'fragrances',
      'skincare',
      'groceries',
      'home-decoration',
      'furniture',
      'womens-dresses',
      'mens-shirts'
    ];
  }
}