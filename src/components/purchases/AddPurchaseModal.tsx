import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { usePurchase } from '../../contexts/PurchaseContext';
import { useInventory } from '../../contexts/InventoryContext';

interface AddPurchaseModalProps {
  onClose: () => void;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ onClose }) => {
  const { addPurchase, suppliers } = usePurchase();
  const { products } = useInventory();
  
  const [formData, setFormData] = useState({
    supplierId: '',
    invoiceNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
  });

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Please add at least one item to the purchase order.');
      return;
    }

    const supplier = suppliers.find(s => s.id === formData.supplierId);
    if (!supplier) return;

    const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    addPurchase({
      supplierId: formData.supplierId,
      supplierName: supplier.name,
      items: selectedItems,
      subtotal,
      tax,
      total,
      orderDate: formData.orderDate,
      expectedDelivery: formData.expectedDelivery,
      status: 'pending',
      invoiceNumber: formData.invoiceNumber,
      userId: '1', // This would come from auth context
    });
    
    onClose();
  };

  const addItem = (product: any) => {
    const existingIndex = selectedItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * product.costPrice;
      setSelectedItems(updated);
    } else {
      setSelectedItems([...selectedItems, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        costPrice: product.costPrice,
        total: product.costPrice,
      }]);
    }
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    } else {
      const updated = [...selectedItems];
      updated[index].quantity = quantity;
      updated[index].total = quantity * updated[index].costPrice;
      setSelectedItems(updated);
    }
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">New Purchase Order</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter invoice number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date *
              </label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Delivery *
              </label>
              <input
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                required
                min={formData.orderDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Products */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Products</h3>
              <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">Cost: ${product.costPrice.toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(product)}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-xs"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Items</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                {selectedItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No items selected</p>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">${item.costPrice.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            ${item.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedItems.length > 0 && (
                  <div className="border-t mt-4 pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedItems.length === 0}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseModal;