import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: String,
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    gstNumber: String,
    paymentTerms: {
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 45', 'COD', 'Prepaid'],
      default: 'COD',
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export const Supplier = mongoose.model('Supplier', SupplierSchema);
