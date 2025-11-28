import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file paths
const dataDir = path.join(__dirname, 'data');
const productsFile = path.join(dataDir, 'products.json');
const salesFile = path.join(dataDir, 'sales.json');
const suppliersFile = path.join(dataDir, 'suppliers.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize JSON files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(salesFile)) {
    fs.writeFileSync(salesFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(suppliersFile)) {
    fs.writeFileSync(suppliersFile, JSON.stringify([], null, 2));
  }
};

initializeFiles();

// Helper functions to read/write JSON
const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
};

// ===== PRODUCTS API =====
// Get all products
app.get('/api/products', (req, res) => {
  const products = readJSON(productsFile);
  res.json(products);
});

// Add new product
app.post('/api/products', (req, res) => {
  const products = readJSON(productsFile);
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  writeJSON(productsFile, products);
  res.json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const products = readJSON(productsFile);
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index > -1) {
    products[index] = { ...products[index], ...req.body };
    writeJSON(productsFile, products);
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const products = readJSON(productsFile);
  const filtered = products.filter((p) => p.id !== req.params.id);
  writeJSON(productsFile, filtered);
  res.json({ message: 'Product deleted' });
});

// ===== SALES API =====
// Get all sales
app.get('/api/sales', (req, res) => {
  const sales = readJSON(salesFile);
  res.json(sales);
});

// Add new sale (billing)
app.post('/api/sales', (req, res) => {
  const sales = readJSON(salesFile);
  const newSale = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  sales.push(newSale);
  writeJSON(salesFile, sales);
  res.json(newSale);
});

// Get sales by date range (for daily/monthly reports)
app.get('/api/sales/report/:period', (req, res) => {
  const sales = readJSON(salesFile);
  const period = req.params.period; // 'daily' or 'monthly'
  const now = new Date();

  let filteredSales = sales;
  if (period === 'daily') {
    const today = now.toISOString().split('T')[0];
    filteredSales = sales.filter((s) =>
      s.createdAt.startsWith(today)
    );
  } else if (period === 'monthly') {
    const currentMonth = now.toISOString().slice(0, 7);
    filteredSales = sales.filter((s) =>
      s.createdAt.startsWith(currentMonth)
    );
  }

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + (s.profit || 0), 0);

  res.json({
    period,
    count: filteredSales.length,
    totalSales,
    totalProfit,
    sales: filteredSales,
  });
});

// ===== SUPPLIERS API =====
// Get all suppliers
app.get('/api/suppliers', (req, res) => {
  const suppliers = readJSON(suppliersFile);
  res.json(suppliers);
});

// Add supplier
app.post('/api/suppliers', (req, res) => {
  const suppliers = readJSON(suppliersFile);
  const newSupplier = {
    id: Date.now().toString(),
    ...req.body,
  };
  suppliers.push(newSupplier);
  writeJSON(suppliersFile, suppliers);
  res.json(newSupplier);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Initialize with sample data
app.post('/api/init-sample-data', (req, res) => {
  const sampleProducts = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      price: 50,
      costPrice: 30,
      quantity: 150,
      minStock: 20,
      barcode: '1234567890123',
      expiryDate: '2025-12-31',
      batchNumber: 'PAR001',
      supplier: 'PharmaCorp Ltd',
      description: 'Effective pain relief and fever reducer',
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      price: 120,
      costPrice: 80,
      quantity: 50,
      minStock: 15,
      barcode: '2345678901234',
      expiryDate: '2025-06-30',
      batchNumber: 'AMO002',
      supplier: 'MediSupply Co',
      description: 'Broad-spectrum antibiotic',
    },
    {
      id: '3',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      price: 80,
      costPrice: 50,
      quantity: 75,
      minStock: 25,
      barcode: '3456789012345',
      expiryDate: '2026-03-15',
      batchNumber: 'VTC003',
      supplier: 'HealthPlus Inc',
      description: 'High-strength Vitamin C supplement',
    },
    {
      id: '4',
      name: 'Insulin Pen',
      category: 'Diabetes Care',
      price: 350,
      costPrice: 220,
      quantity: 12,
      minStock: 10,
      barcode: '4567890123456',
      expiryDate: '2025-08-20',
      batchNumber: 'INS004',
      supplier: 'DiabetesCare Ltd',
      description: 'Fast-acting insulin pen',
    },
    {
      id: '5',
      name: 'Aspirin 100mg',
      category: 'Pain Relief',
      price: 40,
      costPrice: 25,
      quantity: 200,
      minStock: 30,
      barcode: '5678901234567',
      expiryDate: '2025-10-10',
      batchNumber: 'ASP005',
      supplier: 'PharmaCorp Ltd',
      description: 'Daily aspirin for heart health',
    },
  ];

  const sampleSales = [
    {
      id: '1',
      items: [
        { productId: '1', productName: 'Paracetamol 500mg', quantity: 2, price: 50, total: 100 },
        { productId: '3', productName: 'Vitamin C 1000mg', quantity: 1, price: 80, total: 80 },
      ],
      subtotal: 180,
      tax: 31,
      total: 211,
      paymentMethod: 'cash',
      cashReceived: 250,
      changeDue: 39,
      customerName: 'John Doe',
      customerPhone: '9876543210',
      createdAt: new Date().toISOString(),
      userId: '1',
      receiptNumber: 'SP-001',
    },
  ];

  writeJSON(productsFile, sampleProducts);
  writeJSON(salesFile, sampleSales);
  
  res.json({ 
    message: 'Sample data initialized', 
    products: sampleProducts.length,
    sales: sampleSales.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏥 Medical Store Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
});
