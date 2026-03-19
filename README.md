# Boka's Yarn Market

The digital atelier for Boka's handcrafted, slow-fashion yarn goods. This project consists of two separate Blazor WebAssembly applications representing the Admin Dashboard and the Customer Storefront.

## Features & Aesthetic
- Beautiful, intuitive **slow-fashion** aesthetic using soft purple gradients (`#F7E8FA` mapping to `--primary: #7E3091`).
- **User Authentication**: Complete login, registration, and profile management for customers.
- **Automatic Input Logging**: Every significant user and admin input (orders, registrations, profile updates, settings) triggers an automatic `.txt` file log download for data persistence and auditing.
- Custom layouts utilizing lightweight vanilla CSS and high-quality web-safe structure.
- In-memory mock data integration ensuring cohesive flow without a live database dependency (enabling static Netlify deployments).

## Applications

### 1. Customer Portal (`customer/BokaMarket.Customer`)
The actual e-commerce application for premium yarn goods.
- **Authentication**: Sign in/up to manage your artisan profile.
- **Catalog & Details**: Interactive inventory and elegant product displays.
- **Cart/Checkout**: Seamless lay-by and payment flows.
- **Profile**: Update shipping and personal details.

**To Run Locally:**
```bash
cd customer/BokaMarket.Customer
dotnet run
```

### 2. Admin Dashboard (`BokaMarket.Admin`)
The backend management system for managing orders and artisanal work.
- **Overview**: Central KPIs and sales tracking.
- **Orders & Invoices**: Manage production statuses and generate digital invoices.
- **Inventory**: Full product management with custom modals.
- **Logging**: All admin actions (saving products, updating settings) are automatically logged to local text files.

**To Run Locally:**
```bash
cd BokaMarket.Admin
dotnet run
```

## Structure
Both applications run as Client-Side WebAssembly (WASM) models and utilize a shared architecture for `InMemoryDataService`. This service handles state during the live session and facilitates the "Save to TXT" logging mechanism to ensure no user input is lost.

Crafting Slowly. Living Intentionally.
© 2026 Boka's Yarn Market. All rights reserved.
