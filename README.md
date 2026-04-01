# Boka's Yarn Market (v2 - Production Ready)

The digital atelier for Boka's handcrafted, slow-fashion yarn goods. This project has been upgraded from a static prototype to a **full-stack production-ready architecture**.

## 🚀 NEW: Architecture v2
The project now features a **Client-Server model** for permanent data storage and multi-user synchronization.

1.  **BokaMarket.Server (NEW)**: ASP.NET Core Web API with SQLite database context.
2.  **BokaMarket.Shared (NEW)**: Centralized data models shared across all projects.
3.  **BokaMarket.Customer**: Frontend storefront updated for real-time API communication.
4.  **BokaMarket.Admin**: Management dashboard now directly connected to the central database.

## ✨ Features & Aesthetic
- **Premium Design**: Intuitive slow-fashion aesthetic with a curated color palette and professional product photography.
- **Permanent Data**: All products, orders, and user accounts are now stored in a persistent SQLite database (`BokaMarket.db`).
- **Real-Time Admin**: Add or remove products instantly. The storefront updates automatically.
- **Artisanal Catalog**: Seeded with high-quality crochet and knitted items, including lavender cardigans and macramé decor.

## 🛠 Applications & Setup

### 1. Master Solution
Open the **`BokaMarket.sln`** in **Visual Studio 2026** to manage the entire ecosystem at once.

### 2. Backend API (`BokaMarket.Server`)
The "Brain" of the operation. Must be running for the storefronts to work.
- **Endpoints**: `api/products`, `api/orders`, `api/auth`, etc.
- **Database**: SQLite (Automatic creation and seeding).

**To Run:**
```bash
cd BokaMarket.Server
dotnet run
```

### 3. Customer Storefront (`customer/BokaMarket.Customer`)
- **API Linked**: All products are fetched from the live database.
- **Async Loading**: Seamless, non-blocking user experience.

### 4. Admin Dashboard (`BokaMarket.Admin`)
- **Product Management**: Create, edit, and delete items.
- **Order Tracking**: Manage production statuses from a central source.

## 📦 Categories
Our collection is now organized into:
- **Knitted Wear**: Sweaters and cardigans.
- **Crochet Fashion**: Handcrafted apparel.
- **Home Decor**: Macramé and fiber art.
- **Supplies**: Hand-dyed merino yarn for other crafters.

---
Crafting Slowly. Living Intentionally.  
© 2026 Boka's Yarn Market. All rights reserved.
