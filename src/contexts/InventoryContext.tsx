import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  barcode: string;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  getExpiringProducts: () => Product[];
  searchProducts: (query: string) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        price: 5.99,
        costPrice: 3.50,
        stock: 150,
        minStock: 20,
        barcode: '1234567890123',
        expiryDate: '2025-12-31',
        batchNumber: 'PAR001',
        supplier: 'PharmaCorp Ltd',
        description: 'Effective pain relief and fever reducer',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 12.50,
        costPrice: 8.75,
        stock: 8,
        minStock: 15,
        barcode: '2345678901234',
        expiryDate: '2024-06-30',
        batchNumber: 'AMO002',
        supplier: 'MediSupply Co',
        description: 'Broad-spectrum antibiotic',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10'
      },
      {
        id: '3',
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        price: 8.75,
        costPrice: 5.25,
        stock: 75,
        minStock: 25,
        barcode: '3456789012345',
        expiryDate: '2026-03-15',
        batchNumber: 'VTC003',
        supplier: 'HealthPlus Inc',
        description: 'High-strength Vitamin C supplement',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12'
      },
      {
        id: '4',
        name: 'Insulin Pen',
        category: 'Diabetes Care',
        price: 35.00,
        costPrice: 22.50,
        stock: 12,
        minStock: 10,
        barcode: '4567890123456',
        expiryDate: '2024-08-20',
        batchNumber: 'INS004',
        supplier: 'DiabetesCare Ltd',
        description: 'Fast-acting insulin pen',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-08'
      }
    ];
    
    const storedProducts = localStorage.getItem('pharmacy_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(sampleProducts);
      localStorage.setItem('pharmacy_products', JSON.stringify(sampleProducts));
    }
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.minStock);
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