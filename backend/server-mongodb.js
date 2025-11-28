import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/database.js';
import { Product } from './models/Product.js';
import { Sale } from './models/Sale.js';
import { Supplier } from './models/Supplier.js';
import { InventoryHistory } from './models/InventoryHistory.js';
import { StoreSettings } from './models/StoreSettings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
let dbConnected = false;
connectDB().then((success) => {
  dbConnected = success;
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend is running!',
    database: dbConnected ? 'Connected to MongoDB' : 'Using JSON fallback',
    timestamp: new Date().toISOString(),
  });
});

// ===== STORE SETTINGS =====
// Get store settings
app.get('/api/store-settings', async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      // Create default settings
      settings = new StoreSettings({
        storeName: '🏥 Medical Store',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
        },
        businessDetails: {
          gstin: '27AABXX0000A1Z5',
        },
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Get store settings error:', error);
    res.status(500).json({ error: 'Failed to fetch store settings' });
  }
});

// Update store settings
app.put('/api/store-settings', async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update store settings error:', error);
    res.status(500).json({ error: 'Failed to update store settings' });
  }
});

// ===== PRODUCTS API =====
// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    // Log to inventory history
    await InventoryHistory.create({
      productId: newProduct._id,
      productName: newProduct.name,
      action: 'STOCK_ADD',
      quantityBefore: 0,
      quantityAfter: newProduct.quantity,
      quantityChanged: newProduct.quantity,
      notes: 'Initial stock added',
    });

    res.json(newProduct);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Track quantity changes
    const oldQuantity = product.quantity;
    Object.assign(product, req.body);
    await product.save();

    if (oldQuantity !== product.quantity) {
      await InventoryHistory.create({
        productId: product._id,
        productName: product.name,
        action: 'STOCK_ADD',
        quantityBefore: oldQuantity,
        quantityAfter: product.quantity,
        quantityChanged: product.quantity - oldQuantity,
        notes: 'Stock updated',
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get products with expiry alerts
app.get('/api/products/alerts/expiring', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringProducts = await Product.find({
      expiryDate: { $gte: today, $lte: thirtyDaysFromNow },
    }).sort({ expiryDate: 1 });

    res.json(expiringProducts);
  } catch (error) {
    console.error('Get expiring products error:', error);
    res.status(500).json({ error: 'Failed to fetch expiring products' });
  }
});

// Get low stock products
app.get('/api/products/alerts/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] },
    });

    res.json(lowStockProducts);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// ===== SALES API =====
// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Create new sale
app.post('/api/sales', async (req, res) => {
  try {
    // Calculate profit for the sale using product costPrice (if available)
    let profit = 0;
    for (const item of req.body.items || []) {
      const product = await Product.findById(item.productId);
      const cost = product && (product.costPrice ?? product.costprice) ? (product.costPrice ?? product.costprice) : 0;
      const itemPrice = item.price ?? 0;
      const qty = item.quantity ?? 0;
      profit += (itemPrice - cost) * qty;
    }

    // Save sale with computed profit
    const saleData = { ...req.body, profit };
    const newSale = new Sale(saleData);
    await newSale.save();

    // Update product quantities and track in history (after sale saved)
    for (const item of req.body.items || []) {
      const product = await Product.findById(item.productId);
      if (product) {
        const oldQty = product.quantity;
        product.quantity = Math.max(0, product.quantity - (item.quantity || 0));
        await product.save();

        await InventoryHistory.create({
          productId: product._id,
          productName: product.name,
          action: 'SOLD',
          quantityBefore: oldQty,
          quantityAfter: product.quantity,
          quantityChanged: -(item.quantity || 0),
          reference: newSale._id,
          notes: `Sold via receipt ${newSale.receiptNumber}`,
        });
      }
    }

    res.json(newSale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get sales by date range
app.get('/api/sales/report/daily', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    res.json({
      period: 'daily',
      count: sales.length,
      totalSales,
      totalProfit,
      sales,
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({ error: 'Failed to fetch daily report' });
  }
});

// Get monthly sales report
app.get('/api/sales/report/monthly', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const sales = await Sale.find({
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    res.json({
      period: 'monthly',
      month: startOfMonth.toLocaleString('en-IN', {
        month: 'long',
        year: 'numeric',
      }),
      count: sales.length,
      totalSales,
      totalProfit,
      sales,
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly report' });
  }
});

// ===== SUPPLIERS API =====
// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('products');
    res.json(suppliers);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Add supplier
app.post('/api/suppliers', async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.json(newSupplier);
  } catch (error) {
    console.error('Add supplier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update supplier
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(supplier);
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== INVENTORY HISTORY API =====
// Get inventory history for a product
app.get('/api/inventory-history/:productId', async (req, res) => {
  try {
    const history = await InventoryHistory.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error('Get inventory history error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory history' });
  }
});

// ===== SAMPLE DATA =====
// Initialize with sample data
app.post('/api/init-sample-data', async (req, res) => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Sale.deleteMany({});
    await Supplier.deleteMany({});
    await InventoryHistory.deleteMany({});

    // Create sample supplier
    const supplier = await Supplier.create({
      name: 'PharmaCorp Ltd',
      contactPerson: 'Mr. Sharma',
      phone: '+91-9876543210',
      email: 'sales@pharmacorp.com',
      address: {
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
      },
      gstNumber: '07AABCT1234A1Z0',
      rating: 5,
    });

    // Create sample products
    const products = await Product.create([
      {
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        price: 50,
        costPrice: 30,
        quantity: 150,
        minStock: 20,
        barcode: '1234567890123',
        expiryDate: new Date('2025-12-31'),
        batchNumber: 'PAR001',
        supplier: 'PharmaCorp Ltd',
        description: 'Effective pain relief and fever reducer',
      },
      {
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics',
        price: 120,
        costPrice: 80,
        quantity: 50,
        minStock: 15,
        barcode: '2345678901234',
        expiryDate: new Date('2025-06-30'),
        batchNumber: 'AMO002',
        supplier: 'MediSupply Co',
        description: 'Broad-spectrum antibiotic',
      },
      {
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        price: 80,
        costPrice: 50,
        quantity: 75,
        minStock: 25,
        barcode: '3456789012345',
        expiryDate: new Date('2026-03-15'),
        batchNumber: 'VTC003',
        supplier: 'HealthPlus Inc',
        description: 'High-strength Vitamin C supplement',
      },
      {
        name: 'Insulin Pen',
        category: 'Diabetes Care',
        price: 350,
        costPrice: 220,
        quantity: 12,
        minStock: 10,
        barcode: '4567890123456',
        expiryDate: new Date('2025-08-20'),
        batchNumber: 'INS004',
        supplier: 'DiabetesCare Ltd',
        description: 'Fast-acting insulin pen',
      },
      {
        name: 'Aspirin 100mg',
        category: 'Pain Relief',
        price: 40,
        costPrice: 25,
        quantity: 200,
        minStock: 30,
        barcode: '5678901234567',
        expiryDate: new Date('2025-10-10'),
        batchNumber: 'ASP005',
        supplier: 'PharmaCorp Ltd',
        description: 'Daily aspirin for heart health',
      },
    ]);

    res.json({
      message: 'Sample data initialized',
      products: products.length,
      suppliers: 1,
    });
  } catch (error) {
    console.error('Init sample data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏥 Medical Store Backend Running!`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📁 Database: ${dbConnected ? 'MongoDB ✅' : 'Fallback to JSON'}`);
  console.log(`\n📝 Quick Start:`);
  console.log(`   Initialize sample data: POST http://localhost:${PORT}/api/init-sample-data`);
  console.log(`   Get all products: GET http://localhost:${PORT}/api/products`);
  console.log(`   Get store settings: GET http://localhost:${PORT}/api/store-settings`);
  console.log(`\n`);
});
