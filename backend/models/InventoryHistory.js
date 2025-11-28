import mongoose from 'mongoose';

const InventoryHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: String,
    action: {
      type: String,
      enum: ['STOCK_ADD', 'STOCK_REMOVE', 'SOLD', 'EXPIRED', 'DAMAGED', 'RETURN'],
      required: true,
    },
    quantityBefore: Number,
    quantityAfter: Number,
    quantityChanged: {
      type: Number,
      required: true,
    },
    reference: String, // Sale ID, Purchase ID, etc.
    notes: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
InventoryHistorySchema.index({ productId: 1, createdAt: -1 });
InventoryHistorySchema.index({ action: 1 });
InventoryHistorySchema.index({ createdAt: -1 });

export const InventoryHistory = mongoose.model(
  'InventoryHistory',
  InventoryHistorySchema
);
