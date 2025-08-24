import React from 'react';
import DashboardOverview from './DashboardOverview';
import InventoryManagement from '../inventory/InventoryManagement';
import POSSystem from '../pos/POSSystem';
import PurchaseManagement from '../purchases/PurchaseManagement';
import UserManagement from '../users/UserManagement';
import ReportsAnalytics from '../reports/ReportsAnalytics';
import Settings from '../settings/Settings';

interface DashboardProps {
  currentView: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <InventoryManagement />;
      case 'pos':
        return <POSSystem />;
      case 'purchases':
        return <PurchaseManagement />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return <div className="space-y-6">{renderView()}</div>;
};

export default Dashboard;