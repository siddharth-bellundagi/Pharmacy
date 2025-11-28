# 🏥 Medical Store Software - Complete Setup & Features Guide

## 📊 What's New in This Update

You now have a **production-ready medical store system** with MongoDB, advanced alerts, and custom store settings!

### ✨ New Features Added:

1. **✅ MongoDB Database** - Real data storage (no more JSON files!)
2. **✅ Expiry Date Alerts** - Automatic alerts for medicines expiring soon
3. **✅ Low Stock Alerts** - Notifications when inventory falls below minimum
4. **✅ Inventory History** - Complete track of all stock movements
5. **✅ Store Settings** - Customize store name, address, GST, tax rate
6. **✅ Advanced Reporting** - Better analytics with database queries

---

## 🚀 Quick Start (MongoDB Setup)

### Step 1: Choose Your Database Option

#### 🌐 Option A: MongoDB Atlas (Cloud) - RECOMMENDED

**Best for:** Production, no installation needed, free tier

1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster (512MB storage)
3. Create database user with password
4. Copy connection string
5. Set in backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pharmacy
   ```

#### 💾 Option B: Local MongoDB

**Best for:** Development, full control

1. Download: https://www.mongodb.com/try/download/community
2. Install (Windows: MSI installer)
3. Start service: `net start MongoDB`
4. Backend uses: `mongodb://localhost:27017/pharmacy`

### Step 2: Start the System

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Output should show:
```
🏥 Medical Store Backend Running!
📊 API Base URL: http://localhost:5000/api
📁 Database: Connected to MongoDB ✅
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit: `http://localhost:5173`

### Step 3: Initialize Sample Data

Create first sample medicines:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/init-sample-data" -Method POST
```

---

## 📋 Feature Guide

### 1. **Store Settings** (NEW!)

**What it does:** Customize your medical store details

**How to use:**
1. Click "Settings" → New "Store Settings" section
2. Fill in:
   - Store name (e.g., "Sharma Medical Store")
   - Address (Street, City, State, Pincode)
   - Contact (Phone, Email, Website)
   - Business Details (GSTIN, PAN, License Number)
   - Tax Rate (default: 17% for India)
   - Alert thresholds

3. Click "Save Settings"
4. Settings are saved to MongoDB and persist forever!

**Fields:**
- **Store Name:** Your shop name (appears on receipts)
- **GSTIN:** Your GST Identification Number
- **PAN:** Permanent Account Number
- **Proprietor Name:** Owner name
- **License Number:** Medical store license number
- **Tax Rate:** GST percentage (default 17%)
- **Low Stock Alert:** Threshold for low stock (default: 7 days)
- **Expiry Alert:** Show alert X days before expiry (default: 30 days)

---

### 2. **Expiry Date Alerts** (NEW!)

**What it does:** Warns you about medicines expiring soon

**Where you see it:**
- Dashboard shows alerts
- POS system shows alerts for products near expiry
- Reports section shows expiring medicines

**How alerts work:**
- 🔴 **Critical** (Red): Expires in ≤7 days → Must clear stock
- 🟡 **Warning** (Yellow): Expires in 8-30 days → Plan clearance

**Best practices:**
- Check alerts every morning
- Prioritize critical alerts for discounts/giveaways
- Set your alert threshold in Store Settings

---

### 3. **Low Stock Alerts** (NEW!)

**What it does:** Notifies when inventory falls below minimum

**How to set:**
1. Go to Inventory → Add/Edit Product
2. Set "Min Stock" field (e.g., 20 units)
3. When stock ≤ 20, you'll get alerts

**Alerts show:**
- Product name
- Current quantity
- Minimum threshold
- "Dismiss" button

---

### 4. **Inventory History** (NEW!)

**What it does:** Complete record of stock movements

**Tracks:**
- STOCK_ADD: Added new stock
- SOLD: Sold via POS
- EXPIRED: Removed expired items
- DAMAGED: Damaged/destroyed
- RETURN: Customer returns

**Example:**
```
Paracetamol 500mg:
- 15-Nov: +150 units (STOCK_ADD) - Initial stock
- 16-Nov: -2 units (SOLD)
- 17-Nov: -5 units (SOLD)
- Current: 143 units
```

---

### 5. **Store Settings Component** (NEW!)

**Save store information in MongoDB:**

Fields available:
- ✅ Store name & address
- ✅ Phone, email, website
- ✅ GST, PAN, License
- ✅ Currency & tax rate
- ✅ Alert thresholds
- ✅ Proprietor name
- ✅ Business type

**This data persists in MongoDB** and survives app restarts!

---

## 🔄 Workflow Example

### Day 1: Opening Your Store

```
1. Start Backend: npm run dev
2. Start Frontend: npm run dev
3. Go to Settings → Store Settings
4. Enter your store details:
   - Store Name: "Sharma Medical Store"
   - Address: "123 MG Road, Mumbai, Maharashtra 400001"
   - Phone: "+91-98765-43210"
   - GSTIN: "27AABCT1234A1Z0"
5. Click Save
6. Go to Inventory → Add Products with:
   - Name, category, price, cost price
   - Expiry date (very important!)
   - Batch number
   - Quantity
```

### Day 2-30: Normal Operations

```
1. Dashboard shows:
   - "3 critical expiry alerts"
   - "2 low stock items"
2. Click dismiss to acknowledge
3. Create sales via POS
4. Inventory auto-updates
5. History tracks everything
```

---

## 📊 Database Schema (Behind the Scenes)

### Products Collection
```javascript
{
  name: "Paracetamol 500mg",
  price: 50,
  costPrice: 30,
  quantity: 150,
  minStock: 20,
  expiryDate: 2025-12-31,
  batchNumber: "PAR001",
  alerts: [
    { type: "LOW_STOCK", message: "...", acknowledged: false }
  ]
}
```

### Sales Collection
```javascript
{
  receiptNumber: "SP-20251128-120000-001",
  items: [ { productId, quantity, price, total } ],
  total: 500,
  profit: 150,
  createdAt: 2025-11-28,
  customerName: "John Doe"
}
```

### Inventory History Collection
```javascript
{
  productId: "...",
  action: "SOLD",
  quantityBefore: 150,
  quantityAfter: 148,
  quantityChanged: -2,
  reference: "sale-id",
  createdAt: 2025-11-28T10:30:00Z
}
```

### Store Settings Collection
```javascript
{
  storeName: "Sharma Medical Store",
  address: { city: "Mumbai", state: "Maharashtra", ... },
  contact: { phone: "+91-...", email: "..." },
  businessDetails: { gstin: "27...", pan: "...", ... },
  billing: { currency: "INR", taxRate: 17 },
  alerts: { expiryAlertDays: 30, lowStockThreshold: 7 }
}
```

---

## 🛠️ API Endpoints Reference

### Store Settings
```
GET  /api/store-settings           → Get store details
PUT  /api/store-settings           → Update store details
```

### Products with Alerts
```
GET  /api/products/alerts/expiring → List expiring medicines
GET  /api/products/alerts/low-stock → List low stock items
```

### Complete API List
See `backend/MONGODB_SETUP.md` for full API documentation

---

## 🔧 Customizing for Your Store

### Change Tax Rate
1. Settings → Store Settings
2. Set "Tax Rate" to your rate
3. Save
4. All future bills use new rate

### Change Alert Thresholds
1. Settings → Store Settings
2. Low Stock Alert: When to alert (default: 7 days)
3. Expiry Alert: Days before expiry (default: 30 days)
4. Save

### Customize Store Name on Receipts
1. Settings → Store Settings
2. Change "Store Name"
3. Save
4. Future receipts show new name!

---

## 🚨 Troubleshooting

### MongoDB not connecting?

**Error:** `Failed to connect to MongoDB`

**Solutions:**
1. Using Atlas: Check internet connection
2. Using Local: Run `net start MongoDB` in PowerShell (Admin)
3. Check `.env` has correct URI

### Backend shows "Fallback to JSON"?

**Means:** MongoDB not connected, using JSON files temporarily

**Fix:**
- Check MongoDB status
- Verify `.env` MONGODB_URI
- Restart backend: `npm run dev`

### Alerts not showing?

**Check:**
1. Products have expiry dates?
2. Stock below minimum?
3. Refresh page (F5)
4. Check backend is running

### Settings not saving?

**Check:**
1. Backend is running and MongoDB connected
2. No error in browser console (F12)
3. Check network tab in DevTools
4. Verify MONGODB_URI in `.env`

---

## 📈 Next Steps

### Now You Can:
1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Customize store details
3. ✅ Add medicines with expiry dates
4. ✅ See automatic alerts
5. ✅ Track inventory history
6. ✅ Generate reports

### Future Enhancements:
- [ ] Email notifications for alerts
- [ ] SMS alerts for critical stock
- [ ] Barcode scanning
- [ ] Multi-user with permissions
- [ ] Cloud backup
- [ ] Mobile app

---

## 📞 Support

For each issue:
1. Check the troubleshooting section above
2. Look at backend logs (terminal)
3. Open browser DevTools (F12) → Console
4. Check MongoDB connection: GET `/api/health`

---

## 🎉 Congratulations!

Your medical store system is now:
- ✅ Production-ready
- ✅ Using real database
- ✅ Has full alert system
- ✅ Customizable for your shop
- ✅ Tracks all inventory changes

**Happy selling! 💊🏥**
