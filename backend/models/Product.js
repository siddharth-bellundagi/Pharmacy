import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Pain Relief',
        'Antibiotics',
        'Vitamins',
        'Diabetes Care',
        'Heart Health',
        'Respiratory',
        'Skin Care',
        'Digestive Health',
        'Mental Health',
        'Allergy Relief',
        'First Aid',
        'Other',
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minStock: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    description: String,
    manufacturer: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastRestocked: Date,
    alerts: [
      {
        type: {
          type: String,
          enum: ['LOW_STOCK', 'EXPIRING_SOON', 'EXPIRED'],
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        acknowledged: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
ProductSchema.index({ expiryDate: 1 });
ProductSchema.index({ quantity: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model('Product', ProductSchema);
