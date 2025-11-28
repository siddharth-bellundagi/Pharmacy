import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useSales } from "../../contexts/SalesContext";
import { useInventory } from "../../contexts/InventoryContext";
import { usePurchase } from "../../contexts/PurchaseContext";

const ReportsAnalytics: React.FC = () => {
  const { sales, getTotalRevenue, getTodaySales } = useSales();
  const { products, getLowStockProducts } = useInventory();
  const { purchases } = usePurchase();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const todaySales = getTodaySales();
  const totalRevenue = getTotalRevenue();
  const lowStockCount = getLowStockProducts().length;

  // Calculate analytics
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return saleDate >= start && saleDate <= end;
  });

  const periodRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );
  const periodTransactions = filteredSales.length;
  const averageTransaction =
    periodTransactions > 0 ? periodRevenue / periodTransactions : 0;

  // Sales by category
  const salesByCategory = filteredSales.reduce((acc, sale) => {
    sale.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        acc[product.category] = (acc[product.category] || 0) + item.total;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  // Top selling products
  const productSales = filteredSales.reduce((acc, sale) => {
    sale.items.forEach((item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Daily sales trend (last 7 days)
  const dailySales = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toDateString();

    const daySales = sales.filter(
      (sale) => new Date(sale.createdAt).toDateString() === dateStr
    );

    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
    };
  });

  const exportReport = () => {
    const reportData = {
      period: `${dateRange.startDate} to ${dateRange.endDate}`,
      summary: {
        totalRevenue: periodRevenue,
        totalTransactions: periodTransactions,
        averageTransaction: averageTransaction,
      },
      salesByCategory,
      topProducts,
      dailySales,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `pharmacy-report-${dateRange.startDate}-${dateRange.endDate}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <button
          onClick={exportReport}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Date Range:
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Period Revenue
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${periodRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {periodTransactions} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg Transaction
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${averageTransaction.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Per sale</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.length}
              </p>
              <p className="text-xs text-gray-500">{lowStockCount} low stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {todaySales.length}
              </p>
              <p className="text-xs text-gray-500">
                $
                {todaySales
                  .reduce((sum, sale) => sum + sale.total, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Sales Trend
            </h3>
          </div>
          <div className="space-y-4">
            {dailySales.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {day.date}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.max(
                          (day.revenue /
                            Math.max(...dailySales.map((d) => d.revenue))) *
                            100,
                          2
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {day.sales}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${day.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h3>
          </div>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    ₹{product.revenue.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No sales data available for this period
              </p>
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sales by Category
            </h3>
          </div>
          <div className="space-y-4">
            {Object.entries(salesByCategory).length > 0 ? (
              Object.entries(salesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([category, revenue], index) => (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        {category}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${Math.max(
                              (revenue /
                                Math.max(...Object.values(salesByCategory))) *
                                100,
                              2
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{revenue.toFixed(2)}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No category data available
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                Total Revenue (All Time)
              </span>
              <span className="font-semibold text-gray-900">
                ₹{totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Sales</span>
              <span className="font-semibold text-gray-900">
                {sales.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Purchases</span>
              <span className="font-semibold text-gray-900">
                {purchases.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Low Stock Items</span>
              <span className="font-semibold text-red-600">
                {lowStockCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
