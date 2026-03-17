# Boka's Yarn Market

The digital atelier for Boka's handcrafted, slow-fashion yarn goods. This project consists of two separate Blazor WebAssembly applications representing the Admin Dashboard and the Customer Storefront.

## Features & Aesthetic
- Beautiful, intuitive **slow-fashion** aesthetic using soft purple gradients (`#F7E8FA` mapping to `--primary: #7E3091`).
- Custom layouts utilizing lightweight vanilla CSS and high-quality web-safe structure.
- In-memory mock data integration ensuring cohesive flow without a live database dependency (enabling static Netlify deployments).

## Applications

### 1. Customer Portal (`BokaMarket.Customer`)
The actual e-commerce application. Focuses on premium display of artisinal knitwear.
- **Home**: Banner highlights and an elegant new arrivals showcase.
- **Catalog**: Entire product selection view.
- **Product Details**: Shows dynamic inventory ("Only 5 left in stock!"), descriptions, and an interactive image gallery. Allows Add to Cart or starting a Lay-by.
- **Cart/Checkout**: Full review page and structured form for customer delivery & deposit details.

**To Run Locally:**
```bash
cd customer/BokaMarket.Customer
dotnet run
```

### 2. Admin Dashboard (`BokaMarket.Admin`)
The backend management system designed cleanly for managing custom work and large orders without friction.
- **Overview**: Central KPIs.
- **Orders & Invoices**: Editing statuses from *In Production* to *Ready for Pickup*. Can generate customized PDF/digital invoices.
- **Inventory**: Creating & Modifying new yarns/hook sets on the fly with a dedicated custom modal popup.
- **Bulk Requests**: Negotiation and confirmation flows.
- **Reviews**: Moderating customer feedback.

**To Run Locally:**
```bash
cd BokaMarket.Admin
dotnet run
```

## Structure
Both applications run purely as Client-Side WebAssembly models and utilize `InMemoryDataService` for storing state during a live session, satisfying structural constraints while maintaining interactive flow.

Crafting Slowly. Living Intentionally.
