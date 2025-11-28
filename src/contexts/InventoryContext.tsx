import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  minStock: number;
  barcode: string;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InventoryContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  getExpiringProducts: () => Product[];
  searchProducts: (query: string) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Normalize backend product shape to frontend expectations
      const normalized = data.map((p: any) => ({
        id: p.id || p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        costPrice: p.costPrice,
        quantity: p.quantity ?? p.stock ?? 0,
        stock: p.quantity ?? p.stock ?? 0, // alias used by POS
        minStock: p.minStock,
        barcode: p.barcode,
        expiryDate: p.expiryDate,
        batchNumber: p.batchNumber,
        supplier: typeof p.supplier === 'object' && p.supplier?._id ? p.supplier._id : p.supplier,
        description: p.description,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setProducts(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product via API
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      const newProduct = await response.json();
      const normalizedNew = {
        id: newProduct.id || newProduct._id,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        costPrice: newProduct.costPrice,
        quantity: newProduct.quantity ?? newProduct.stock ?? 0,
        stock: newProduct.quantity ?? newProduct.stock ?? 0,
        minStock: newProduct.minStock,
        barcode: newProduct.barcode,
        expiryDate: newProduct.expiryDate,
        batchNumber: newProduct.batchNumber,
        supplier: typeof newProduct.supplier === 'object' && newProduct.supplier?._id ? newProduct.supplier._id : newProduct.supplier,
        description: newProduct.description,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
      };
      setProducts([...products, normalizedNew]);
    } catch (err) {
      console.error('Add product error:', err);
      throw err;
    }
  };

  // Update product via API
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      const normalizedUpdated = {
        id: updatedProduct.id || updatedProduct._id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        costPrice: updatedProduct.costPrice,
        quantity: updatedProduct.quantity ?? updatedProduct.stock ?? 0,
        stock: updatedProduct.quantity ?? updatedProduct.stock ?? 0,
        minStock: updatedProduct.minStock,
        barcode: updatedProduct.barcode,
        expiryDate: updatedProduct.expiryDate,
        batchNumber: updatedProduct.batchNumber,
        supplier: typeof updatedProduct.supplier === 'object' && updatedProduct.supplier?._id ? updatedProduct.supplier._id : updatedProduct.supplier,
        description: updatedProduct.description,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      };
      setProducts(products.map(p => p.id === id ? normalizedUpdated : p));
    } catch (err) {
      console.error('Update product error:', err);
      throw err;
    }
  };

  // Delete product via API
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete product error:', err);
      throw err;
    }
  };

  // Local helper functions
  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity <= product.minStock);
  };

  const getExpiringProducts = () => {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    return products.filter(product => {
      const expiryDate = new Date(product.expiryDate);
      return expiryDate <= sixMonthsFromNow;
    });
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.barcode.includes(query) ||
      product.supplier.toLowerCase().includes(lowercaseQuery)
    );
  };



  return (
    <InventoryContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getLowStockProducts,
        getExpiringProducts,
        searchProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};