import React, { useState, useEffect } from 'react';
import { AlertCircle, Package, TrendingDown, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface Alert {
  id: string;
  type: 'EXPIRING' | 'LOW_STOCK';
  product: {
    _id: string;
    name: string;
    quantity: number;
    minStock: number;
    expiryDate: string;
  };
  message: string;
  severity: 'critical' | 'warning';
}

export const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // Get expiring products
      const expiringRes = await fetch(`${API_BASE_URL}/products/alerts/expiring`);
      const expiringProducts = expiringRes.ok ? await expiringRes.json() : [];

      // Get low stock products
      const lowStockRes = await fetch(`${API_BASE_URL}/products/alerts/low-stock`);
      const lowStockProducts = lowStockRes.ok ? await lowStockRes.json() : [];

      const newAlerts: Alert[] = [];

      // Process expiring products
      expiringProducts.forEach((product: any) => {
        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        let severity: 'critical' | 'warning' = 'warning';
        let message = `Expires in ${daysUntilExpiry} days`;

        if (daysUntilExpiry <= 7) {
          severity = 'critical';
          message = `⚠️ URGENT: Expires in ${daysUntilExpiry} days`;
        } else if (daysUntilExpiry <= 14) {
          severity = 'warning';
          message = `Expires in ${daysUntilExpiry} days - Plan clearance`;
        }

        newAlerts.push({
          id: `expiring-${product._id}`,
          type: 'EXPIRING',
          product,
          message,
          severity,
        });
      });

      // Process low stock products
      lowStockProducts.forEach((product: any) => {
        const shortage = product.minStock - product.quantity;
        newAlerts.push({
          id: `low-stock-${product._id}`,
          type: 'LOW_STOCK',
          product,
          message: `Low stock: ${product.quantity} left (min: ${product.minStock})`,
          severity: product.quantity === 0 ? 'critical' : 'warning',
        });
      });

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Fetch alerts error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (alertId: string) => {
    setAcknowledged([...acknowledged, alertId]);
  };

  const activeAlerts = alerts.filter((alert) => !acknowledged.includes(alert.id));
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
  const warningAlerts = activeAlerts.filter((a) => a.severity === 'warning');

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      {activeAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criticalAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">
                    {criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-red-700">Immediate action needed</div>
                </div>
              </div>
            </div>
          )}

          {warningAlerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-900">
                    {warningAlerts.length} Warning{warningAlerts.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-yellow-700">Review soon</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alert List */}
      {activeAlerts.length > 0 ? (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded flex items-start justify-between ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-400'
                  : 'bg-yellow-50 border-yellow-400'
              }`}
            >
              <div className="flex items-start space-x-3 flex-1">
                {alert.type === 'EXPIRING' ? (
                  <Clock className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {alert.product.name}
                  </div>
                  <div className={`text-sm ${
                    alert.severity === 'critical'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                    {alert.message}
                  </div>
                  {alert.type === 'EXPIRING' && (
                    <div className="text-xs text-gray-600 mt-1">
                      Expiry Date: {new Date(alert.product.expiryDate).toLocaleDateString(
                        'en-IN'
                      )}
                    </div>
                  )}
                  {alert.type === 'LOW_STOCK' && (
                    <div className="text-xs text-gray-600 mt-1">
                      Current: {alert.product.quantity} | Minimum: {alert.product.minStock}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleAcknowledge(alert.id)}
                className="ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex-shrink-0"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className="text-center py-8 text-gray-500">Loading alerts...</div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">All Clear!</div>
              <div className="text-sm text-green-700">No active alerts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;
