#!/usr/bin/env node
import 'dotenv/config.js';
import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import { Supplier } from './models/Supplier.js';
import { StoreSettings } from './models/StoreSettings.js';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmacy';

async function initializeData() {
  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected!');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await StoreSettings.deleteMany({});

    // Create default supplier
    console.log('📍 Creating default supplier...');
    const supplier = await Supplier.create({
      name: 'PharmaCorp Ltd',
      contactPerson: 'Raj Kumar',
      phone: '+91-9876543210',
      email: 'supply@pharmacorp.com',
      address: {
        street: '123 Industrial Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      gstNumber: '27AABCT1234H1Z0',
      paymentTerms: 'Net 30',
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'HDFC0000001'
      },
      rating: 4.5,
      totalPurchases: 0,
      isActive: true
    });

    // Create sample products
    console.log('💊 Creating sample products...');
    const sampleProducts = [
      {
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        price: 50,
        costPrice: 30,
        quantity: 150,
        minStock: 20,
        barcode: 'PARA001',
        expiryDate: new Date('2026-12-31'),
        batchNumber: 'PARA/26/001',
        supplier: supplier._id,
        manufacturer: 'GSK India',
        description: 'Fever and pain relief tablet'
      },
      {
        name: 'Aspirin 75mg',
        category: 'Heart Health',
        price: 45,
        costPrice: 25,
        quantity: 200,
        minStock: 30,
        barcode: 'ASPI001',
        expiryDate: new Date('2026-06-30'),
        batchNumber: 'ASPI/26/002',
        supplier: supplier._id,
        manufacturer: 'Bayer',
        description: 'Antiplatelet medication'
      },
      {
        name: 'Amoxicillin 500mg',
        category: 'Antibiotics',
        price: 120,
        costPrice: 70,
        quantity: 80,
        minStock: 15,
        barcode: 'AMOX001',
        expiryDate: new Date('2025-12-31'),
        batchNumber: 'AMOX/25/003',
        supplier: supplier._id,
        manufacturer: 'Cipla',
        description: 'Broad-spectrum antibiotic'
      },
      {
        name: 'Metformin 500mg',
        category: 'Diabetes Care',
        price: 85,
        costPrice: 50,
        quantity: 120,
        minStock: 25,
        barcode: 'METF001',
        expiryDate: new Date('2026-03-31'),
        batchNumber: 'METF/26/004',
        supplier: supplier._id,
        manufacturer: 'Lupin',
        description: 'Diabetes management'
      },
      {
        name: 'Vitamin C 500mg',
        category: 'Vitamins',
        price: 60,
        costPrice: 35,
        quantity: 250,
        minStock: 50,
        barcode: 'VITC001',
        expiryDate: new Date('2026-09-30'),
        batchNumber: 'VITC/26/005',
        supplier: supplier._id,
        manufacturer: 'Himalaya',
        description: 'Immune system booster'
      },
      {
        name: 'Cetirizine 10mg',
        category: 'Allergy Relief',
        price: 55,
        costPrice: 32,
        quantity: 90,
        minStock: 20,
        barcode: 'CETI001',
        expiryDate: new Date('2025-11-30'),
        batchNumber: 'CETI/25/006',
        supplier: supplier._id,
        manufacturer: 'Cipla',
        description: 'Antihistamine for allergies'
      }
    ];

    await Product.insertMany(sampleProducts);

    // Create store settings
    console.log('🏪 Creating store settings...');
    await StoreSettings.create({
      storeName: 'Wellness Medical Store',
      address: {
        street: '456 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400050'
      },
      contact: {
        phone: '+91-9876543211',
        email: 'wellness@medical.com',
        website: 'www.wellnessmedical.com'
      },
      businessDetails: {
        gstin: '27AABCU1234H2Z5',
        panNumber: 'AABCU1234H',
        proprietor: 'Ravi Sharma',
        licenseNumber: 'PH-2024-1234567',
        licenseExpiry: new Date('2025-12-31')
      },
      billing: {
        currency: 'INR',
        taxRate: 17,
        businessType: 'Medical Store'
      },
      operatingHours: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '09:00', close: '21:00' },
        sunday: { open: '10:00', close: '20:00' }
      },
      alerts: {
        lowStockThreshold: 20,
        expiryAlertDays: 30,
        enableEmailAlerts: false,
        enableSMSAlerts: false
      }
    });

    console.log('✅ Sample data initialized successfully!');
    console.log('📊 Created:');
    console.log('   - 1 Supplier');
    console.log('   - 6 Sample Products');
    console.log('   - Store Settings');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing data:', error.message);
    process.exit(1);
  }
}

initializeData();
