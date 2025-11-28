import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Receipt,
  Calculator,
  IndianRupee,
} from "lucide-react";
import { useInventory } from "../../contexts/InventoryContext";
import { useSales } from "../../contexts/SalesContext";

const POSSystem: React.FC = () => {
  const { products, searchProducts } = useInventory();
  const {
    currentSale,
    addToSale,
    removeFromSale,
    updateQuantity,
    clearSale,
    completeSale,
  } = useSales();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });
  const [showCheckout, setShowCheckout] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "All" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.17; 
  const total = subtotal + tax;
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const changeDue = cashReceivedNum - total;

  const handleAddToSale = (product: any) => {
    if (product.stock > 0) {
      addToSale(product, 1);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && newQuantity <= product.stock) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCompleteSale = async () => {
    if (cashReceivedNum < total) {
      alert("Insufficient cash received!");
      return;
    }

    setIsProcessing(true);

    try {
      const sale = completeSale(
        cashReceivedNum,
        customerInfo.name || customerInfo.phone ? customerInfo : undefined
      );

      // Reset form
      setCustomerInfo({ name: "", phone: "" });
      setCashReceived("");
      setShowCheckout(false);

      alert(
        `Sale completed successfully!\nReceipt: ${
          sale.receiptNumber
        }\nChange Due: ₹${changeDue.toFixed(2)}`
      );
    } catch (error) {
      alert("Error processing sale. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const quickCashAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Point of Sale System
        </h1>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            Currency:{" "}
            <span className="font-semibold text-blue-600">
              ₹ (Indian Rupee)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by name or barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category === "All" ? "" : category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Available Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.slice(0, 20).map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          SKU: {product.barcode}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                      <button
                        onClick={() => handleAddToSale(product)}
                        disabled={product.stock === 0}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Shopping Cart
              </h3>
              <ShoppingCart className="h-5 w-5 text-gray-400" />
            </div>

            {currentSale.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Cart is empty</p>
                <p className="text-xs text-gray-400 mt-2">
                  Add products to start a sale
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {currentSale.map((item, index) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    const maxQty = product?.stock || 0;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price.toFixed(2)} each
                          </p>
                          <p className="text-xs text-gray-400">Max: {maxQty}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded border"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 0;
                              if (qty <= maxQty) {
                                handleUpdateQuantity(item.productId, qty);
                              }
                            }}
                            className="w-12 text-center text-sm border rounded px-1 py-1"
                            min="1"
                            max={maxQty}
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= maxQty}
                            className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded border disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeFromSale(item.productId)}
                            className="p-1 text-red-400 hover:text-red-600 ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{item.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (17%):</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>TOTAL:</span>
                      <span className="text-blue-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {!showCheckout ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Customer name (optional)"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            name: e.target.value,
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Phone (optional)"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            phone: e.target.value,
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </button>

                    <button
                      onClick={clearSale}
                      className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-gray-900">Cash Payment</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cash Received (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          min={total}
                          value={cashReceived}
                          onChange={(e) => setCashReceived(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={total.toFixed(2)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {quickCashAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCashReceived(amount.toString())}
                          className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>

                    {cashReceivedNum > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Total:</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cash Received:</span>
                          <span>₹{cashReceivedNum.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
                          <span>Change Due:</span>
                          <span
                            className={
                              changeDue >= 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            ₹{changeDue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowCheckout(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCompleteSale}
                        disabled={cashReceivedNum < total || isProcessing}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isProcessing ? (
                          "Processing..."
                        ) : (
                          <>
                            <Receipt className="h-4 w-4 mr-2" />
                            Complete Sale
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;
