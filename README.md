
# Headless Shop API

## Overview
Headless Shop is a TypeScript Express backend for a headless e-commerce platform. It supports cart management, promo codes, checkout, and order management with MongoDB.

## Setup
1. Clone the repository
2. Install dependencies:
	```bash
	npm install
	```
3. Configure your MongoDB connection in `.env`
4. Start the server:
	```bash
	npm run dev
	```

## API Endpoints

### Cart Operations
- **Create Cart**: `POST /api/carts`
- **Add Item to Cart**: `POST /api/carts/:id/items`
- **Update Item Quantity**: `PATCH /api/carts/:id/items/:itemId`
- **Remove Item from Cart**: `DELETE /api/carts/:id/items/:itemId`
- **Get Cart By ID**: `GET /api/carts/:id`
- **Get All Carts**: `GET /api/carts`
- **Apply Promo Code**: `POST /api/carts/:id/apply-promo`

### Checkout & Orders
- **Checkout (Create Order)**: `POST /api/checkout`
- **List Orders**: `GET /api/orders`
- **Update Order Status**: `PATCH /api/orders/:id`

## Usage
Use the provided Postman collection (`Cart_Item_Operations.postman_collection.json`) to test all endpoints. Replace placeholder IDs with real values from your database.

## Example Cart Flow
1. Create a cart
2. Add items using valid product and variant IDs
3. Update or remove items as needed
4. Apply a promo code (optional)
5. Checkout to create an order
6. List and manage orders

## Technologies
- Node.js, Express, TypeScript
- MongoDB (Mongoose)
- Zod (validation)
- Jest/Supertest (testing)

## License
MIT
