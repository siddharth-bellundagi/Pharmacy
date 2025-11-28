import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface StoreSettings {
  id?: string;
  storeName: string;
  address: {
    street: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  businessDetails?: {
    gstin: string;
    panNumber: string;
    proprietor: string;
    licenseNumber: string;
    licenseExpiry: string;
  };
  billing?: {
    currency: string;
    taxRate: number;
    businessType: string;
  };
  alerts?: {
    lowStockThreshold: number;
    expiryAlertDays: number;
    enableEmailAlerts: boolean;
    enableSMSAlerts: boolean;
  };
}

interface SettingsContextType {
  settings: StoreSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<StoreSettings>;
  fetchSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch store settings from backend
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/store-settings`);
      if (!response.ok) throw new Error('Failed to fetch store settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching settings';
      setError(message);
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update store settings
  const updateSettings = async (
    updates: Partial<StoreSettings>
  ): Promise<StoreSettings> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/store-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      const updated = await response.json();
      setSettings(updated);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating settings';
      setError(message);
      console.error('Update settings error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSettings,
        fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
