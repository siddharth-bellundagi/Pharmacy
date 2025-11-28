import React from "react";
import {
  DollarSign,
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useSales } from "../../contexts/SalesContext";
import { useInventory } from "../../contexts/InventoryContext";
import { usePurchase } from "../../contexts/PurchaseContext";
import { useUserManagement } from "../../contexts/UserContext";
import { useSettings } from "../../contexts/SettingsContext";

const DashboardOverview: React.FC = () => {
  const { getTodaySales, getTotalRevenue } = useSales();
  const { products, getLowStockProducts, getExpiringProducts } = useInventory();
  const { getPendingPurchases } = usePurchase();
  const { getActiveUsers } = useUserManagement();
  const { settings } = useSettings();

  const todaySales = getTodaySales();
  const totalRevenue = getTotalRevenue();
  const todayRevenue = todaySales.reduce(
    (total, sale) => total + sale.total,
    0
  );
  const lowStockProducts = getLowStockProducts();
  const expiringProducts = getExpiringProducts();
  const pendingPurchases = getPendingPurchases();
  const activeUsers = getActiveUsers();

  const stats = [
    {
      title: "Today's Sales",
      value: `USD ${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: `${todaySales.length} transactions`,
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: `${lowStockProducts.length} low stock`,
    },
    {
      title: "Total Revenue",
      value: `USD ${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "All time",
    },
    {
      title: "Active Users",
      value: activeUsers.length.toString(),
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      change: "System users",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-lg text-blue-600 font-semibold mt-1">{settings?.storeName}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h3>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                All products are well-stocked!
              </p>
            ) : (
              lowStockProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.stock} units remaining
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                </div>
              ))
            )}
            {lowStockProducts.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{lowStockProducts.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Expiring Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Expiring Soon
            </h3>
          </div>
          <div className="space-y-3">
            {expiringProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No products expiring soon!
              </p>
            ) : (
              expiringProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expires:{" "}
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Expiring
                  </span>
                </div>
              ))
            )}
            {expiringProducts.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{expiringProducts.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">New Sale</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                +$45.60
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Stock Updated
                </p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Inventory
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Purchase Order
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
