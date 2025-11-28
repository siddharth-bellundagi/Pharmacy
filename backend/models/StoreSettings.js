import mongoose from 'mongoose';

const StoreSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: '🏥 Medical Store',
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    businessDetails: {
      gstin: String,
      panNumber: String,
      proprietor: String,
      licenseNumber: String,
      licenseExpiry: Date,
    },
    billing: {
      currency: {
        type: String,
        default: 'INR',
      },
      taxRate: {
        type: Number,
        default: 17,
      },
      businessType: {
        type: String,
        enum: ['Pharmacy', 'Medical Store', 'Chemist', 'Other'],
        default: 'Medical Store',
      },
    },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    alerts: {
      lowStockThreshold: {
        type: Number,
        default: 7, // days before expiry to show alert
      },
      expiryAlertDays: {
        type: Number,
        default: 30, // days before expiry to show alert
      },
      enableEmailAlerts: {
        type: Boolean,
        default: true,
      },
      enableSMSAlerts: {
        type: Boolean,
        default: false,
      },
    },
    logo: String, // Base64 or URL
  },
  {
    timestamps: true,
  }
);

export const StoreSettings = mongoose.model('StoreSettings', StoreSettingsSchema);
