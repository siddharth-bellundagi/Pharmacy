import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  total: number;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'delivered' | 'cancelled';
  invoiceNumber: string;
  createdAt: string;
  userId: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface PurchaseContextType {
  purchases: Purchase[];
  suppliers: Supplier[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  updatePurchaseStatus: (id: string, status: Purchase['status']) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplier: (id: string) => Supplier | undefined;
  getPendingPurchases: () => Purchase[];
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const sampleSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'PharmaCorp Ltd',
        contactPerson: 'John Smith',
        email: 'orders@pharmacorp.com',
        phone: '+1-555-0123',
        address: '123 Medical Drive, City, State 12345',
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        name: 'MediSupply Co',
        contactPerson: 'Sarah Johnson',
        email: 'supply@medisupply.com',
        phone: '+1-555-0456',
        address: '456 Healthcare Blvd, City, State 67890',
        createdAt: '2024-01-02',
      },
    ];

    const samplePurchases: Purchase[] = [
      {
        id: '1',
        supplierId: '1',
        supplierName: 'PharmaCorp Ltd',
        items: [
          {
            productId: '1',
            productName: 'Paracetamol 500mg',
            quantity: 100,
            costPrice: 3.50,
            total: 350.00,
          },
        ],
        subtotal: 350.00,
        tax: 28.00,
        total: 378.00,
        orderDate: '2024-01-15',
        expectedDelivery: '2024-01-20',
        status: 'delivered',
        invoiceNumber: 'INV-2024-001',
        createdAt: '2024-01-15',
        userId: '1',
      },
    ];

    const storedSuppliers = localStorage.getItem('pharmacy_suppliers');
    const storedPurchases = localStorage.getItem('pharmacy_purchases');
    
    if (storedSuppliers) {
      setSuppliers(JSON.parse(storedSuppliers));
    } else {
      setSuppliers(sampleSuppliers);
      localStorage.setItem('pharmacy_suppliers', JSON.stringify(sampleSuppliers));
    }

    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases));
    } else {
      setPurchases(samplePurchases);
      localStorage.setItem('pharmacy_purchases', JSON.stringify(samplePurchases));
    }
  }, []);

  const addPurchase = (purchaseData: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedPurchases = [...purchases, newPurchase];
    setPurchases(updatedPurchases);
    localStorage.setItem('pharmacy_purchases', JSON.stringify(updatedPurchases));
  };

  const updatePurchaseStatus = (id: string, status: Purchase['status']) => {
    const updatedPurchases = purchases.map(purchase =>
      purchase.id === id ? { ...purchase, status } : purchase
    );
    setPurchases(updatedPurchases);
    localStorage.setItem('pharmacy_purchases', JSON.stringify(updatedPurchases));
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    localStorage.setItem('pharmacy_suppliers', JSON.stringify(updatedSuppliers));
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === id ? { ...supplier, ...updates } : supplier
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem('pharmacy_suppliers', JSON.stringify(updatedSuppliers));
  };

  const deleteSupplier = (id: string) => {
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
    setSuppliers(updatedSuppliers);
    localStorage.setItem('pharmacy_suppliers', JSON.stringify(updatedSuppliers));
  };

  const getSupplier = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  const getPendingPurchases = () => {
    return purchases.filter(purchase => purchase.status === 'pending');
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        suppliers,
        addPurchase,
        updatePurchaseStatus,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplier,
        getPendingPurchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};