import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSales } from '../../contexts/SalesContext';

interface DailyData {
  date: string;
  sales: number;
  profit: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Analytics: React.FC = () => {
  const { sales } = useSales();
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({ totalSales: 0, totalProfit: 0, count: 0 });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch daily report from backend
  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sales/report/daily`);
      if (!response.ok) throw new Error('Failed to fetch daily report');
      const data = await response.json();
      
      // Format data for chart
      if (data.sales && data.sales.length > 0) {
        const formatted = data.sales.map((sale: any) => ({
          date: new Date(sale.createdAt).toLocaleTimeString(),
          sales: sale.total,
          profit: sale.profit || (sale.total * 0.2), // Estimate profit if not provided
        }));
        setDailyData(formatted);
      }
    } catch (error) {
      console.error('Fetch daily report error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly report from backend
  const fetchMonthlyReport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/report/monthly`);
      if (!response.ok) throw new Error('Failed to fetch monthly report');
      const data = await response.json();
      setMonthlyStats({
        totalSales: data.totalSales || 0,
        totalProfit: data.totalProfit || 0,
        count: data.count || 0,
      });
    } catch (error) {
      console.error('Fetch monthly report error:', error);
    }
  };

  // Calculate category breakdown from sales
  const calculateCategoryData = () => {
    const categoryMap: { [key: string]: number } = {};
    
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        categoryMap[item.productName] = (categoryMap[item.productName] || 0) + item.total;
      });
    });

    const formatted = Object.entries(categoryMap).map(([name, value]) => ({
      name: name.substring(0, 12) + (name.length > 12 ? '...' : ''),
      value: Math.round(value),
    }));

    setCategoryData(formatted);
  };

  useEffect(() => {
    fetchDailyReport();
    fetchMonthlyReport();
    calculateCategoryData();
  }, [sales]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Today's Sales</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            ₹{dailyData.reduce((sum, d) => sum + d.sales, 0).toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs text-gray-500 mt-1">{dailyData.length} transactions</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">This Month's Sales</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            ₹{monthlyStats.totalSales.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs text-gray-500 mt-1">{monthlyStats.count} transactions</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Monthly Profit</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">
            ₹{monthlyStats.totalProfit.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs text-gray-500 mt-1">Estimated</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Daily Sales Trend</h3>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `₹${value}`}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No sales data yet
            </div>
          )}
        </div>

        {/* Sales by Product */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales by Product</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No product data yet
            </div>
          )}
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
          {monthlyStats.totalSales > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'This Month',
                    Sales: monthlyStats.totalSales,
                    Profit: monthlyStats.totalProfit,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="Sales" fill="#8884d8" />
                <Bar dataKey="Profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No monthly data available
            </div>
          )}
        </div>
      </div>

      {loading && <div className="text-center text-gray-600">Loading analytics...</div>}
    </div>
  );
};

export default Analytics;
