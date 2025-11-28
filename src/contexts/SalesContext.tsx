import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./InventoryContext";
import { useSettings } from "./SettingsContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  sku?: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  profit?: number;
  paymentMethod: "cash";
  cashReceived: number;
  changeDue: number;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
  userId?: string;
  receiptNumber: string;
}

interface SalesContextType {
  sales: Sale[];
  currentSale: SaleItem[];
  loading: boolean;
  addToSale: (product: Product, quantity: number) => void;
  removeFromSale: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearSale: () => void;
  completeSale: (
    cashReceived: number,
    customerInfo?: { name?: string; phone?: string }
  ) => Promise<Sale>;
  getTodaySales: () => Sale[];
  getTotalRevenue: () => number;
  getSalesByDateRange: (startDate: string, endDate: string) => Sale[];
  generateReceipt: (sale: Sale) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentSale, setCurrentSale] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  // Fetch sales from backend
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sales`);
      if (!response.ok) throw new Error('Failed to fetch sales');
      const data = await response.json();
      // Normalize backend sale objects (map _id to id, ensure profit field)
      const normalized = data.map((s: any) => ({
        id: s.id || s._id,
        items: s.items || [],
        subtotal: s.subtotal || 0,
        tax: s.tax || 0,
        total: s.total || 0,
        profit: s.profit ?? 0,
        paymentMethod: s.paymentMethod || 'cash',
        cashReceived: s.cashReceived || 0,
        changeDue: s.changeDue || 0,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
        createdAt: s.createdAt,
        userId: s.userId,
        receiptNumber: s.receiptNumber,
      }));
      setSales(normalized);
    } catch (error) {
      console.error('Fetch sales error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const addToSale = (product: Product, quantity: number) => {
    const existingItemIndex = currentSale.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      const updatedSale = [...currentSale];
      updatedSale[existingItemIndex].quantity += quantity;
      updatedSale[existingItemIndex].total =
        updatedSale[existingItemIndex].quantity * product.price;
      setCurrentSale(updatedSale);
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        total: quantity * product.price,
        sku: product.barcode,
      };
      setCurrentSale([...currentSale, newItem]);
    }
  };

  const removeFromSale = (productId: string) => {
    setCurrentSale(currentSale.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromSale(productId);
      return;
    }

    const updatedSale = currentSale.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity,
          total: quantity * item.price,
        };
      }
      return item;
    });
    setCurrentSale(updatedSale);
  };

  const clearSale = () => {
    setCurrentSale([]);
  };

  const generateReceiptNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `SP-${dateStr}-${timeStr}-${random}`;
  };

  const completeSale = async (
    cashReceived: number,
    customerInfo?: { name?: string; phone?: string }
  ): Promise<Sale> => {
    const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.17; 
    const total = subtotal + tax;
    const changeDue = cashReceived - total;

    const newSale: any = {
      // frontend-side sale object; backend will assign its own _id/timestamps
      items: [...currentSale],
      subtotal,
      tax,
      total,
      paymentMethod: "cash",
      cashReceived,
      changeDue,
      customerName: customerInfo?.name,
      customerPhone: customerInfo?.phone,
      receiptNumber: generateReceiptNumber(),
      createdAt: new Date().toISOString(),
    };

    // Send sale to backend
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale),
      });
      if (!response.ok) throw new Error('Failed to save sale');
      const savedSale = await response.json();
      
      // Normalize backend response
      const normalizedSale: Sale = {
        id: savedSale.id || savedSale._id,
        items: savedSale.items || [],
        subtotal: savedSale.subtotal || 0,
        tax: savedSale.tax || 0,
        total: savedSale.total || 0,
        profit: savedSale.profit ?? 0,
        paymentMethod: savedSale.paymentMethod || 'cash',
        cashReceived: savedSale.cashReceived || 0,
        changeDue: savedSale.changeDue || 0,
        customerName: savedSale.customerName,
        customerPhone: savedSale.customerPhone,
        createdAt: savedSale.createdAt,
        userId: savedSale.userId,
        receiptNumber: savedSale.receiptNumber,
      };
      
      setSales([...sales, normalizedSale]);
      setCurrentSale([]);
      generateReceipt(normalizedSale);
      return normalizedSale;
    } catch (error) {
      console.error('Complete sale error:', error);
      throw error;
    }
  };

  const generateReceipt = (sale: Sale) => {
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${sale.receiptNumber}</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            width: 300px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .store-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .store-info {
            font-size: 10px;
            margin-bottom: 2px;
        }
        .receipt-info {
            margin-bottom: 15px;
            font-size: 10px;
        }
        .items {
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .item-details {
            flex: 1;
        }
        .item-name {
            font-weight: bold;
        }
        .item-qty-price {
            font-size: 10px;
            color: #666;
        }
        .item-total {
            font-weight: bold;
            min-width: 60px;
            text-align: right;
        }
        .totals {
            margin-bottom: 15px;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        .total-line.grand-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }
        .payment-info {
            border-top: 1px solid #000;
            padding-top: 10px;
            margin-bottom: 15px;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            border-top: 1px solid #000;
            padding-top: 10px;
        }
        @media print {
            body { width: auto; }
        }
    </style>
</head>
<body>
    <div class="header">
      <div class="store-name">${settings?.storeName || '🏥 MEDICAL STORE'}</div>
      <div class="store-info">${settings?.address?.street || ''} ${settings?.address?.city || ''} ${settings?.address?.state || ''}</div>
      <div class="store-info">Phone: ${settings?.contact?.phone || '+91-XXXXXXXXXX'}</div>
      <div class="store-info">GSTIN: ${settings?.businessDetails?.gstin || '27AABXX0000A1Z5'}</div>
    </div>
    
    <div class="receipt-info">
        <div>Receipt #: ${sale.receiptNumber}</div>
        <div>Date: ${new Date(sale.createdAt).toLocaleDateString("en-IN")}</div>
        <div>Time: ${new Date(sale.createdAt).toLocaleTimeString("en-IN")}</div>
        <div>Cashier: ${sale.userId === "1" ? "Admin" : "Staff"}</div>
        ${sale.customerName ? `<div>Customer: ${sale.customerName}</div>` : ""}
        ${sale.customerPhone ? `<div>Phone: ${sale.customerPhone}</div>` : ""}
    </div>
    
    <div class="items">
        ${sale.items
          .map(
            (item) => `
            <div class="item">
                <div class="item-details">
                    <div class="item-name">${item.productName}</div>
                    <div class="item-qty-price">${
                      item.quantity
                    } x ₹${item.price.toFixed(2)}</div>
                </div>
                <div class="item-total">₹${item.total.toFixed(2)}</div>
            </div>
        `
          )
          .join("")}
    </div>
    
    <div class="totals">
        <div class="total-line">
            <span>Subtotal:</span>
            <span>₹${sale.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-line">
            <span>GST (17%):</span>
            <span>₹${sale.tax.toFixed(2)}</span>
        </div>
        <div class="total-line grand-total">
            <span>TOTAL:</span>
            <span>₹${sale.total.toFixed(2)}</span>
        </div>
    </div>
    
    <div class="payment-info">
        <div class="total-line">
            <span>Cash Received:</span>
            <span>₹${sale.cashReceived.toFixed(2)}</span>
        </div>
        <div class="total-line">
            <span>Change Due:</span>
            <span>₹${sale.changeDue.toFixed(2)}</span>
        </div>
    </div>
    
    <div class="footer">
        <div>Thank you for your business!</div>
        <div>Please keep this receipt for your records</div>
        <div>Exchange/Return within 7 days with receipt</div>
        <div>---</div>
        <div>Powered by  Pharmacy POS</div>
    </div>
</body>
</html>`;

    // Create and download the receipt
    const blob = new Blob([receiptContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${sale.receiptNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also trigger print dialog
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const getTodaySales = () => {
    const today = new Date().toDateString();
    return sales.filter(
      (sale) => new Date(sale.createdAt).toDateString() === today
    );
  };

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const getSalesByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= start && saleDate <= end;
    });
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        currentSale,
        addToSale,
        removeFromSale,
        updateQuantity,
        clearSale,
        completeSale,
        getTodaySales,
        getTotalRevenue,
        getSalesByDateRange,
        generateReceipt,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
};
