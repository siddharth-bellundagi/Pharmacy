import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Building, Phone, Mail, MapPin } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface StoreSettings {
  _id?: string;
  storeName: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  businessDetails: {
    gstin: string;
    panNumber: string;
    proprietor: string;
    licenseNumber: string;
    licenseExpiry: string;
  };
  billing: {
    currency: string;
    taxRate: number;
    businessType: string;
  };
  alerts: {
    lowStockThreshold: number;
    expiryAlertDays: number;
    enableEmailAlerts: boolean;
    enableSMSAlerts: boolean;
  };
}

export const StoreSettingsModal: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: '🏥 Medical Store',
    address: {
      street: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '',
      country: 'India',
    },
    contact: {
      phone: '+91-',
      email: '',
      website: '',
    },
    businessDetails: {
      gstin: '27AABXX0000A1Z5',
      panNumber: '',
      proprietor: '',
      licenseNumber: '',
      licenseExpiry: '',
    },
    billing: {
      currency: 'INR',
      taxRate: 17,
      businessType: 'Medical Store',
    },
    alerts: {
      lowStockThreshold: 7,
      expiryAlertDays: 30,
      enableEmailAlerts: false,
      enableSMSAlerts: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch store settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/store-settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');

      const response = await fetch(`${API_BASE_URL}/store-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('✅ Store settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      address: { ...settings.address, [field]: value },
    });
  };

  const handleContactChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      contact: { ...settings.contact, [field]: value },
    });
  };

  const handleBusinessChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      businessDetails: { ...settings.businessDetails, [field]: value },
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading store settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes('✅')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Medical Store Name"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street Address"
                value={settings.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="City"
                value={settings.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="State"
                value={settings.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={settings.address.pincode}
                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="tel"
                placeholder="Phone"
                value={settings.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={settings.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Website (optional)"
                value={settings.contact.website}
                onChange={(e) => handleContactChange('website', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">GSTIN *</label>
                <input
                  type="text"
                  placeholder="27AABXX0000A1Z5"
                  value={settings.businessDetails.gstin}
                  onChange={(e) => handleBusinessChange('gstin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">PAN Number</label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={settings.businessDetails.panNumber}
                  onChange={(e) => handleBusinessChange('panNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Proprietor Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={settings.businessDetails.proprietor}
                  onChange={(e) => handleBusinessChange('proprietor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">License Number</label>
                <input
                  type="text"
                  placeholder="License No."
                  value={settings.businessDetails.licenseNumber}
                  onChange={(e) => handleBusinessChange('licenseNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Billing Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Currency</label>
                <select
                  value={settings.billing.currency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      billing: { ...settings.billing, currency: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.billing.taxRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      billing: { ...settings.billing, taxRate: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Settings</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  These settings control when alerts are shown for expiring medicines and low stock items.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Low Stock Alert (days)
                </label>
                <input
                  type="number"
                  value={settings.alerts.lowStockThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      alerts: {
                        ...settings.alerts,
                        lowStockThreshold: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Show alert when less than X units</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Expiry Alert (days)
                </label>
                <input
                  type="number"
                  value={settings.alerts.expiryAlertDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      alerts: {
                        ...settings.alerts,
                        expiryAlertDays: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Show alert X days before expiry</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreSettingsModal;
