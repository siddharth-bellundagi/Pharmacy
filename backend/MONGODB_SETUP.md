# 🗄️ MongoDB Setup Guide for Medical Store

## Overview
Your medical store system now supports MongoDB for production-ready database storage!

## Two Options to Connect:

### ✅ Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐

**Advantages:**
- No installation needed
- Free tier: 512MB storage
- Automatic backups
- Access from anywhere
- Easy to scale later

**Steps:**

1. **Sign up for free:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Sign Up" → Create account with email

2. **Create a cluster:**
   - Click "Create" → Choose "Free" tier
   - Select region: Asia Pacific (Mumbai) for faster access
   - Create cluster (takes 1-2 minutes)

3. **Create database user:**
   - Go to Database Access → Add Database User
   - Username: `pharmacy_user`
   - Password: Use auto-generated strong password
   - Copy this password

4. **Get connection string:**
   - Go to Clusters → Connect
   - Choose "Drivers" → "Node.js"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `pharmacy`

5. **Update your `.env` file:**
   ```
   MONGODB_URI=mongodb+srv://pharmacy_user:YOUR_PASSWORD@cluster.mongodb.net/pharmacy
   ```

6. **Save and restart backend:**
   ```bash
   npm run dev
   ```

---

### ✅ Option 2: MongoDB Local

**Advantages:**
- Offline development
- No internet needed
- Full control

**Steps for Windows:**

1. **Download MongoDB Community:**
   - https://www.mongodb.com/try/download/community
   - Download MSI installer for Windows

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"

3. **Verify installation:**
   - Open PowerShell
   - Run: `mongod --version`

4. **Start MongoDB service:**
   - PowerShell (Admin):
   ```powershell
   net start MongoDB
   ```

5. **Update your `.env` file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/pharmacy
   ```

6. **Start backend:**
   ```bash
   npm run dev
   ```

---

## Testing MongoDB Connection

1. **Check health endpoint:**
   ```
   http://localhost:5000/api/health
   ```
   Should show: `"database": "Connected to MongoDB"`

2. **Initialize sample data:**
   ```
   POST http://localhost:5000/api/init-sample-data
   ```
   In PowerShell:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5000/api/init-sample-data" -Method POST
   ```

3. **Verify products were created:**
   ```
   http://localhost:5000/api/products
   ```

---

## Database Features

### ✅ What's New:

1. **Real Database Storage** - All data persists
2. **Expiry Date Tracking** - Automatic alerts for expiring medicines
3. **Low Stock Alerts** - Notified when inventory is low
4. **Inventory History** - Track all stock movements
5. **Store Settings** - Customize your store details in database
6. **Advanced Analytics** - Better reports with MongoDB

### Available Endpoints:

```
Products:
GET    /api/products                    - List all products
POST   /api/products                    - Add new product
GET    /api/products/:id                - Get single product
PUT    /api/products/:id                - Update product
DELETE /api/products/:id                - Delete product
GET    /api/products/alerts/expiring    - Expiring soon
GET    /api/products/alerts/low-stock   - Low stock items

Sales:
GET    /api/sales                       - All sales
POST   /api/sales                       - Create sale
GET    /api/sales/report/daily          - Daily report
GET    /api/sales/report/monthly        - Monthly report

Suppliers:
GET    /api/suppliers                   - List suppliers
POST   /api/suppliers                   - Add supplier
PUT    /api/suppliers/:id               - Update supplier

Store:
GET    /api/store-settings              - Get store details
PUT    /api/store-settings              - Update store details

History:
GET    /api/inventory-history/:productId - Track movements
```

---

## Troubleshooting

### "Failed to connect to MongoDB"

**Solution 1: Check MongoDB Atlas connection string**
- Make sure password is URL-encoded (@ becomes %40)
- Make sure you added your IP to whitelist in MongoDB Atlas
  - Go to Network Access → Add your IP

**Solution 2: Check local MongoDB**
- Verify service is running: `net start MongoDB`
- Try restarting: `net stop MongoDB` then `net start MongoDB`

### "Database not found"

**Solution:**
- The database will be created automatically on first write
- Run: `POST /api/init-sample-data` to create initial data

### Connection string issues?

- MongoDB Atlas: `mongodb+srv://user:password@cluster.mongodb.net/pharmacy`
- Local: `mongodb://localhost:27017/pharmacy`

---

## Switching Between Options

Want to switch from Atlas to Local (or vice versa)?

1. Update `.env` file with new connection string
2. Restart backend: `npm run dev`
3. That's it! Frontend doesn't need changes.

---

## Next Steps

1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Update backend with new server: `npm run dev`
3. ✅ Initialize sample data
4. ✅ Check health endpoint
5. 🔄 Frontend will automatically work (no changes needed!)

Your data is now safe and persistent! 🎉
