# Pharmacy Management System

A lightweight, responsive Pharmacy Management frontend built with React + TypeScript and Vite. This repository contains the UI, contexts, and components for a complete pharmacy point-of-sale and inventory management application intended for demonstration and integration with a backend API.

**Quick Summary:**
- **Project:** Pharmacy Management System (frontend)
- **Purpose:** Inventory, POS, purchases, users, reports, and basic admin workflows for a pharmacy

**Main Features:**
- **User Authentication & Roles:** Login UI with role display and sign-out. Demo credentials included.
- **Dashboard & Analytics:** Overview dashboard components for quick business insights.
- **Inventory Management:** View, add, and edit products via `InventoryManagement`, `AddProductModal`, and `EditProductModal`.
- **Point of Sale (POS):** Checkout and sales interface (`POSSystem`).
- **Purchases & Suppliers:** Purchase entry, management, and supplier screens with add-purchase modal.
- **Sales Tracking:** Centralized sales state via `SalesContext` to support POS and reporting.
- **User Management:** Admin screens for managing staff and their roles (`UserManagement`, `UserContext`).
- **Reporting & Analytics:** Reports section for sales, purchases, and inventory insights (`ReportsAnalytics`).
- **Application Settings:** Settings screen for configurable options (`Settings`).
- **Responsive UI & Navigation:** Responsive header (`Header.tsx`) and sidebar (`Sidebar.tsx`) with mobile overlay and active state highlighting.
- **Reusable Modals & Forms:** Consistent add/edit modals, input validation states, and loading/error UX.

**Demo Credentials (shown in login UI):**
- Admin: `admin` / `admin123`
- Staff: `staff` / `staff123`

**Tech Stack & Tooling:**
- **Framework:** React (with TypeScript)
- **Bundler / Dev Server:** Vite
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **Scripts:** defined in `package.json` (`dev`, `build`, `preview`, `lint`)

**How to run (development):**
1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```


