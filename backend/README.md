# Medical Store Backend

Simple Node.js + Express backend for your medical store pharmacy system.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run the Backend
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Product Structure:**
```json
{
  "id": "unique-id",
  "name": "Medicine Name",
  "category": "category",
  "price": 100,
  "quantity": 50,
  "expiryDate": "2024-12-31",
  "manufacturer": "Manufacturer Name",
  "batchNo": "BATCH123"
}
```

### Sales (Billing)
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale (billing)
- `GET /api/sales/report/daily` - Daily sales & profit report
- `GET /api/sales/report/monthly` - Monthly sales & profit report

**Sale Structure:**
```json
{
  "id": "unique-id",
  "items": [
    {
      "productId": "product-id",
      "quantity": 2,
      "price": 100
    }
  ],
  "totalAmount": 200,
  "profit": 50,
  "paymentMethod": "cash/card/upi"
}
```

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Add new supplier

## Data Storage
All data is stored in JSON files in the `data/` folder:
- `products.json` - Product inventory
- `sales.json` - Sales transactions
- `suppliers.json` - Supplier information

## Notes
- This is a simple backend using JSON files. Perfect for getting started!
- When you're ready for a real database, we'll upgrade to MongoDB or PostgreSQL.
- CORS is enabled so your React frontend can communicate with this backend.
