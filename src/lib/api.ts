import { Product, ProductsResponse, PriceRange } from '@/types';

// Helper function to filter products by price range
function filterProductsByPriceRange(products: Product[], priceRange: PriceRange): Product[] {
  return products.filter(product => 
    product.price >= priceRange.min && product.price <= priceRange.max
  );
}

export async function getProducts(
  page: number = 1, 
  limit: number = 20,
  sortBy?: string,
  order?: 'asc' | 'desc',
  priceRange?: PriceRange
): Promise<ProductsResponse> {
  try {
    // If price filter is applied, we need to fetch more products to ensure we have enough after filtering
    const fetchLimit = priceRange ? Math.max(limit * 5, 100) : limit;
    const skip = priceRange ? 0 : (page - 1) * limit; // Reset skip if filtering by price
    
    let url = `https://dummyjson.com/products?limit=${fetchLimit}&skip=${skip}`;
    
    if (sortBy && order && !priceRange) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: ProductsResponse = await response.json();
    
    let filteredProducts = data.products;
    
    // Apply price range filter if specified
    if (priceRange && (priceRange.min > 0 || priceRange.max < 5000)) {
      filteredProducts = filterProductsByPriceRange(data.products, priceRange);
    }
    
    // Apply client-side sorting if price filter is applied (since API sorting is disabled for price filtering)
    if (priceRange && sortBy && order) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          default:
            comparison = 0;
        }
        
        return order === 'desc' ? -comparison : comparison;
      });
    }
    
    // Apply pagination to filtered results
    const startIndex = priceRange ? (page - 1) * limit : 0;
    const endIndex = startIndex + limit;
    const paginatedProducts = priceRange ? filteredProducts.slice(startIndex, endIndex) : filteredProducts;
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      skip: startIndex,
      limit: limit
    };
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
  order?: 'asc' | 'desc',
  priceRange?: PriceRange
): Promise<ProductsResponse> {
  try {
    // If price filter is applied, we need to fetch more products
    const fetchLimit = priceRange ? Math.max(limit * 5, 100) : limit;
    const skip = priceRange ? 0 : (page - 1) * limit;
    
    let url = `https://dummyjson.com/products/category/${category}?limit=${fetchLimit}&skip=${skip}`;
    
    if (sortBy && order && !priceRange) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const data: ProductsResponse = await response.json();
    
    let filteredProducts = data.products;
    
    // Apply price range filter if specified
    if (priceRange && (priceRange.min > 0 || priceRange.max < 5000)) {
      filteredProducts = filterProductsByPriceRange(data.products, priceRange);
    }
    
    // Apply client-side sorting if price filter is applied
    if (priceRange && sortBy && order) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          default:
            comparison = 0;
        }
        
        return order === 'desc' ? -comparison : comparison;
      });
    }
    
    // Apply pagination to filtered results
    const startIndex = priceRange ? (page - 1) * limit : 0;
    const endIndex = startIndex + limit;
    const paginatedProducts = priceRange ? filteredProducts.slice(startIndex, endIndex) : filteredProducts;
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      skip: startIndex,
      limit: limit
    };
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
  order?: 'asc' | 'desc',
  priceRange?: PriceRange
): Promise<ProductsResponse> {
  try {
    // If price filter is applied, we need to fetch more products
    const fetchLimit = priceRange ? Math.max(limit * 5, 100) : limit;
    const skip = priceRange ? 0 : (page - 1) * limit;
    
    let url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${fetchLimit}&skip=${skip}`;
    
    if (sortBy && order && !priceRange) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data: ProductsResponse = await response.json();
    
    let filteredProducts = data.products;
    
    // Apply price range filter if specified
    if (priceRange && (priceRange.min > 0 || priceRange.max < 5000)) {
      filteredProducts = filterProductsByPriceRange(data.products, priceRange);
    }
    
    // Apply client-side sorting if price filter is applied
    if (priceRange && sortBy && order) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          default:
            comparison = 0;
        }
        
        return order === 'desc' ? -comparison : comparison;
      });
    }
    
    // Apply pagination to filtered results
    const startIndex = priceRange ? (page - 1) * limit : 0;
    const endIndex = startIndex + limit;
    const paginatedProducts = priceRange ? filteredProducts.slice(startIndex, endIndex) : filteredProducts;
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      skip: startIndex,
      limit: limit
    };
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

export async function getPriceRange(): Promise<PriceRange> {
  try {
    // Fetch a sample of products to determine price range
    const response = await fetch('https://dummyjson.com/products?limit=100');
    if (!response.ok) {
      throw new Error('Failed to fetch products for price range');
    }
    const data: ProductsResponse = await response.json();
    
    if (data.products.length === 0) {
      return { min: 0, max: 5000 };
    }
    
    const prices = data.products.map(product => product.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    
    return { min, max };
  } catch (error) {
    console.error('Error fetching price range:', error);
    // Fallback price range
    return { min: 0, max: 5000 };
  }
}