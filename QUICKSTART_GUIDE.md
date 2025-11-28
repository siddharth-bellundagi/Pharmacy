# 🏥 Medical Store Software - Complete Setup & Features Guide

## ✅ What You Have Built

A **complete medical store management system** for India with:
- ✅ **Inventory Management** with expiry date tracking
- ✅ **Billing System (POS)** with instant receipts
- ✅ **Real-time Analytics** with graphs and pie charts
- ✅ **Alert System** for expiring medicines & low stock
- ✅ **Inventory History** tracking all movements
- ✅ **Store Customization** with your details
- ✅ **MongoDB Support** for production database
- ✅ **100% India-Ready** with INR currency & GST

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend
```powershell
cd "c:\Users\Admin\Desktop\pharmacy\pharmacy\backend"
npm run dev
```
✅ Should see: `🏥 Medical Store Backend Running!`

### Step 2: Start Frontend (new terminal)
```powershell
cd "c:\Users\Admin\Desktop\pharmacy\pharmacy"
npm run dev
```
✅ Should see: `http://localhost:5173`

### Step 3: Open in Browser
```
http://localhost:5173
```
✅ You should see the Medical Store dashboard!

---

## 📊 Features Overview

### 1. **Dashboard** 📈
- Overview of today's sales
- Quick access to all modules
- Real-time inventory status

### 2. **Inventory Management** 📦
- Add medicines with:
  - Product name & category
  - Selling & cost price (₹)
  - **Expiry date** (Important!)
  - Batch number & supplier
  - Stock quantity & minimum level
- Edit/Delete products
- Search by name or barcode
- **Automatic alerts** for expiring items
- **Low stock warnings**

### 3. **Point of Sale (Billing)** 💰
- Search products by name/barcode
- Add to cart with quantity
- Calculate totals with **17% GST** (India standard)
- Accept cash payment
- Calculate change automatically
- **Auto-print receipt** with:
  - Store details
  - Products sold
  - Total & change
  - Receipt number

### 4. **Analytics & Reports** 📊
- **Daily Sales Graph** - Track hourly sales
- **Daily Profit Graph** - Monitor margins
- **Sales by Product** - Pie chart showing top items
- **Monthly Performance** - Total sales & profit
- Transaction counts

### 5. **Store Settings** ⚙️
- Customize store name & location
- Business details (GSTIN, PAN, License)
- Contact information
- Billing settings (Currency, Tax rate)
- Alert thresholds

### 6. **Alert System** ⚠️
- **Expiring Soon** - Shows medicines expiring within 30 days
- **Low Stock** - Alert when inventory < minimum
- **Critical Alerts** - Red for urgent action
- **Warning Alerts** - Yellow for review
- Dismiss functionality

---

## 💾 Database Setup

### Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐
No installation needed, free tier includes 512MB.

1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster (Asia Pacific region)
3. Create database user
4. Get connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharmacy
   ```
6. Restart backend: `npm run dev`

### Option 2: MongoDB Local
For offline development.

1. Download: https://www.mongodb.com/try/download/community
2. Install with "Install as Service"
3. Verify: `mongod --version`
4. Start: `net start MongoDB` (PowerShell Admin)
5. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/pharmacy
   ```

See `MONGODB_SETUP.md` for detailed instructions.

---

## 🔌 API Endpoints

### Products
```
GET    /api/products                    List all products
POST   /api/products                    Add product
PUT    /api/products/:id                Update product
DELETE /api/products/:id                Delete product
GET    /api/products/alerts/expiring    Expiring medicines
GET    /api/products/alerts/low-stock   Low stock items
```

### Sales & Billing
```
GET    /api/sales                       All sales
POST   /api/sales                       Create sale/bill
GET    /api/sales/report/daily          Daily totals
GET    /api/sales/report/monthly        Monthly totals
```

### Store Settings
```
GET    /api/store-settings              Get settings
PUT    /api/store-settings              Update settings
```

### Suppliers
```
GET    /api/suppliers                   List suppliers
POST   /api/suppliers                   Add supplier
PUT    /api/suppliers/:id               Update supplier
```

### Inventory History
```
GET    /api/inventory-history/:id       Track movements
```

---

## 📁 Project Structure

```
pharmacy/
├── src/                          Frontend (React + TypeScript)
│   ├── components/
│   │   ├── analytics/            📊 Graphs & Reports
│   │   ├── inventory/            📦 Product management
│   │   ├── pos/                  💰 Billing system
│   │   ├── alerts/               ⚠️  Alert system
│   │   ├── settings/             ⚙️  Store settings
│   │   └── ...
│   └── contexts/                 State management (connected to backend)
│
└── backend/
    ├── server-mongodb.js         🗄️ MongoDB-enabled backend
    ├── models/                   Database schemas
    │   ├── Product.js
    │   ├── Sale.js
    │   ├── Supplier.js
    │   ├── InventoryHistory.js
    │   └── StoreSettings.js
    ├── config/
    │   └── database.js           MongoDB connection
    ├── data/                     JSON fallback (if MongoDB not configured)
    └── .env                      Configuration file
```

---

## 🎯 Common Tasks

### Add a New Medicine
1. Click **Inventory** in sidebar
2. Click **Add Product**
3. Fill details:
   - Name: `Paracetamol 500mg`
   - Category: `Pain Relief`
   - Selling Price: `₹50`
   - Cost Price: `₹30`
   - Quantity: `100`
   - **Expiry Date: 2025-12-31** ⭐ Important!
   - Batch No: `PAR001`
   - Supplier: `PharmaCorp Ltd`
4. Click **Add Product**

### Create a Bill
1. Click **POS** in sidebar
2. Search for medicine
3. Click product → Add to cart
4. Adjust quantity if needed
5. Enter cash received
6. Click **Complete Sale**
7. Receipt auto-prints

### View Reports
1. Click **Reports** in sidebar
2. See graphs for:
   - Daily sales trend
   - Sales by product
   - Monthly performance
3. All calculations automatic!

### Customize Store
1. Click **Settings** in sidebar
2. Fill in your store details:
   - Store name
   - Address (Mumbai, Maharashtra, etc.)
   - Contact (Phone, Email)
   - GSTIN
   - Business type
3. Click **Save Settings**
4. Saved to database automatically!

---

## ✨ Special Features

### 🏥 India-Specific
- ✅ Currency: **Indian Rupees (₹)**
- ✅ Tax: **17% GST** (standard for medicines)
- ✅ Date format: **DD/MM/YYYY**
- ✅ Phone format: **+91**
- ✅ Address: Cities, States in India
- ✅ GSTIN support
- ✅ PAN number field

### 📊 Smart Alerts
- **Expiry tracking** - Automatic 30-day warning
- **Low stock warnings** - When below minimum
- **Critical alerts** - Red for urgent attention
- **Dismissible** - Acknowledge and clear

### 💡 Auto-Features
- ✅ Auto-calculate totals with tax
- ✅ Auto-generate receipt numbers
- ✅ Auto-print receipts
- ✅ Auto-track inventory movements
- ✅ Auto-calculate profit

---

## 🐛 Troubleshooting

### "Failed to connect to backend"
**Solution:** Make sure backend is running on port 5000
```powershell
cd backend
npm run dev
```

### "Cannot add product"
**Solution:** Check browser console (F12) for errors
- Make sure all required fields are filled
- Expiry date must be in future

### "Graphs not showing"
**Solution:** 
1. Add some products first
2. Create a sale via POS
3. Refresh page (F5)

### "Settings not saving"
**Solution:** MongoDB might not be connected
- Check backend for MongoDB connection error
- Settings will still work but won't persist between restarts

---

## 🚀 Next Steps

### Immediate (This Week)
- ✅ Add 20-30 medicines to inventory
- ✅ Test billing system with 10+ sales
- ✅ Verify reports and graphs
- ✅ Test expiry date alerts
- ✅ Customize store settings

### Medium-term (Next 2 weeks)
- Set up MongoDB Atlas for production
- Add more users/staff
- Backup strategy
- Email alerts for expiring stock

### Long-term (Future)
- Multi-store support
- Mobile app
- Supplier integration
- Advanced analytics
- Accounting integration

---

## 📞 Support

**Backend Issues:**
- Check terminal logs in backend folder
- See `MONGODB_SETUP.md` for database help

**Frontend Issues:**
- Open browser console (F12)
- Check for red errors
- Refresh page

**Database Help:**
- See `backend/MONGODB_SETUP.md`
- MongoDB Atlas docs: https://docs.mongodb.com/atlas/

---

## 🎉 You're All Set!

Your medical store software is ready to use!

**Key Points:**
- ✅ Everything stores in database (MongoDB or JSON fallback)
- ✅ All prices in Indian Rupees
- ✅ GST calculations automatic
- ✅ Reports update in real-time
- ✅ Alerts for stock & expiry
- ✅ Customizable for your store

**Start selling today!** 💊

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api
```

Happy selling! 🏥✨
