# 🏥 Medical Store Software - Setup & Usage Guide

## Quick Start Guide

### Step 1: Start the Backend Server
```bash
cd backend
npm run dev
```
You should see: `🏥 Medical Store Backend running on http://localhost:5000`

### Step 2: In another terminal, Start the Frontend
```bash
# From the pharmacy root folder
npm run dev
```
You should see: `http://localhost:5173` (or similar port)

### Step 3: Initialize Sample Data
Open your browser and go to:
```
http://localhost:5173
```

Then initialize sample data by opening another tab and visiting:
```
http://localhost:5000/api/init-sample-data
```
(Just POST request - you can use Postman or curl)

Or in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/init-sample-data" -Method POST
```

---

## 📋 Features Overview

### 1. **Inventory Management**
   - View all products with expiry dates
   - Add new medicines
   - Edit existing products
   - Delete products
   - See low stock alerts
   - Track batch numbers and suppliers

**To Add a Product:**
1. Click "Inventory" in sidebar
2. Click "Add Product"
3. Fill in details:
   - Product name
   - Category (Pain Relief, Antibiotics, etc.)
   - Price (selling price)
   - Cost Price
   - Quantity
   - Expiry Date ⚠️ (Important for medical store)
   - Batch Number
   - Supplier Name
4. Click "Add Product"

### 2. **Billing (POS System)**
   - Search products
   - Add to cart/bill
   - Adjust quantities
   - Calculate totals with tax (17% GST)
   - Accept cash payment
   - Calculate change
   - Print receipt

**To Create a Bill:**
1. Click "POS" in sidebar
2. Search for product name or barcode
3. Click product to add to bill
4. Adjust quantity if needed
5. Enter cash received
6. Click "Complete Sale"
7. Receipt will auto-print

### 3. **Reports & Analytics** 📊
   - Daily sales graph
   - Daily profit graph
   - Sales by product (pie chart)
   - Monthly performance
   - Daily transaction count
   - Monthly total sales and profit

**View Analytics:**
1. Click "Reports" in sidebar
2. See graphs update automatically as you make sales

---

## 🗂️ Project Structure

```
pharmacy/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── analytics/           # NEW: Charts & graphs
│   │   ├── inventory/           # Manage products
│   │   ├── pos/                 # Billing system
│   │   └── ...
│   ├── contexts/                # Updated to use backend API
│   │   ├── InventoryContext.tsx # Now calls backend
│   │   └── SalesContext.tsx     # Now calls backend
│   └── ...
│
└── backend/                      # Node.js + Express backend
    ├── server.js               # Main API server
    ├── data/                   # JSON file storage
    │   ├── products.json       # Product database
    │   ├── sales.json          # Sales/billing records
    │   └── suppliers.json      # Supplier info
    └── package.json
```

---

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Product Format:**
```json
{
  "name": "Paracetamol 500mg",
  "category": "Pain Relief",
  "price": 50,
  "costPrice": 30,
  "quantity": 150,
  "minStock": 20,
  "barcode": "1234567890123",
  "expiryDate": "2025-12-31",
  "batchNumber": "PAR001",
  "supplier": "PharmaCorp Ltd",
  "description": "Description here"
}
```

### Sales/Billing
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/report/daily` - Daily report
- `GET /api/sales/report/monthly` - Monthly report

---

## 💡 How It Works (Behind the Scenes)

1. **Frontend (React)** - User interface where you add products and create bills
2. **Context API** - Manages product and sales state
3. **Backend (Express)** - Receives requests and stores data
4. **JSON Files** - Simple database (`backend/data/` folder)
5. **Recharts** - Creates beautiful graphs automatically

---

## 🎯 Next Steps

### Phase 2 (Optional Upgrades):
- [ ] Switch to real database (MongoDB or PostgreSQL)
- [ ] Add user authentication
- [ ] Add inventory expiry alerts
- [ ] Email receipt delivery
- [ ] Backup system
- [ ] Multi-store support

### For Now:
- ✅ Add 10-20 products
- ✅ Create 5-10 sample sales to see graphs
- ✅ Test expiry date tracking
- ✅ Print receipts

---

## 🐛 Troubleshooting

### "Failed to fetch products"
- Backend not running? Run `npm run dev` in `/backend` folder

### Graphs show "No data yet"
- Add some sales first by using POS system
- Or initialize sample data with the endpoint above

### Port 5000 already in use
Edit `backend/server.js` line 8:
```javascript
const PORT = 5001; // Change to another port
```

### Frontend not updating after adding products
- Check browser console for errors (F12)
- Make sure backend is running on http://localhost:5000

---

## 📞 Support

This is a custom system built for your medical store in India. All data is stored locally in JSON files for now.

**Need to:**
- Add more fields? Edit `src/contexts/InventoryContext.tsx`
- Change tax rate? Edit `src/contexts/SalesContext.tsx` (line with `tax = subtotal * 0.17`)
- Add new reports? Edit `src/components/analytics/Analytics.tsx`

Happy selling! 💊
