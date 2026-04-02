# BokaMarket 🧶✨

BokaMarket is a premium, artisanal e-commerce platform dedicated to handcrafted fiber arts, crochet, and knitted treasures. Built with a modern ASP.NET Core Backend and Blazor WebAssembly Frontends, it offers a seamless, boho-chic shopping experience for both customers and administrators.

## 🚀 Phase Status & Features

### ✅ Phase 1: Storefront Excellence
- **Sunlit Boho Design**: A warm, premium aesthetic using soft lavenders, sage greens, and macramé-inspired accents.
- **Dynamic Catalog**: Full product listing with categories and high-quality AI-generated imagery.
- **Interactive Product Details**: Deep dives into artisanal craftsmanship with smooth transitions.

### ✅ Phase 2: Secure Infrastructure
- **JWT Authentication**: Robust security using industry-standard `HmacSha256` token signing.
- **Role-Based Access**: Specialized portals for Customers and Administrators.
- **Security Hardened**: All dependencies patched to latest secure versions (including `System.Text.Json` 8.0.5+).

### ✅ Phase 3: Seamless Commerce
- **Dynamic Cart Management**: Persistent shopping cart using local storage.
- **Artisanal Checkout**: High-end flow with real-time validation and Stripe integration.
- **Order Tracking**: Backend infrastructure for order persistence and status.

### ✅ Phase 4: Operational Mastery (New!)
- **Inventory Auto-Sync**: Real-time stock reduction during the checkout process.
- **Detailed Fulfillment**: Admin-level itemization, courier tracking, and shipping management.
- **Customer Transparently**: "My Orders" history and live tracking added to the customer profile.
- **Enhanced Data Models**: Relational tracking of `OrderItems` for production-grade accuracy.

## 🛠️ Technology Stack
- **Backend**: ASP.NET Core 10.0 Web API
- **Frontend**: Blazor WebAssembly (Customer & Admin Portals)
- **Database**: Entity Framework Core
- **Security**: JWT (JSON Web Tokens)
- **Styling**: Vanilla CSS with modern tokens and Google Fonts (Outfit, Inter)

## 📦 Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ST10440322-Bokamoso-Sebake/boka.git
   ```

2. **Run the Backend**:
   - Navigate to `BokaMarket.Server`
   - Run `dotnet run` (Port: 7123)

3. **Run the Customer Portal**:
   - Navigate to `customer/BokaMarket.Customer`
   - Run `dotnet run`

4. **Run the Admin Portal**:
   - Navigate to `BokaMarket.Admin`
   - Run `dotnet run`

## 🔗 Deployment
- **Frontend**: Deployed to Vercel (Configured for WASM)
- **Backend**: API endpoints accessible via configured production URLs.

---
*Crafted with ❤️ by Bokamoso Sebake*
