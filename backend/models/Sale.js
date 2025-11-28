import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: Number,
        total: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'cheque'],
      default: 'cash',
    },
    cashReceived: Number,
    changeDue: Number,
    customerName: String,
    customerPhone: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundDate: Date,
    refundReason: String,
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
SaleSchema.index({ createdAt: -1 });
SaleSchema.index({ receiptNumber: 1 });
SaleSchema.index({ total: -1 });

export const Sale = mongoose.model('Sale', SaleSchema);
