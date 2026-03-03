# FishMarket - Online Fish Orders & Delivery App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Customer-facing storefront with fish product catalog (browse, filter by category, search)
- Product detail pages with descriptions, price, weight, freshness info
- Shopping cart: add/remove items, update quantities
- Checkout flow: customer info, delivery address, order placement
- Order tracking page for customers (view order status)
- Admin panel (role-based access):
  - Dashboard with summary stats (total orders, revenue, pending deliveries)
  - Product management (add, edit, delete fish products with categories and stock)
  - Order management (view all orders, update order status: pending, confirmed, out for delivery, delivered, cancelled)
  - Customer list view
- Role-based access: "admin" role for admin panel, regular users for storefront

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend
- `User` type with profile (name, address, phone)
- `Product` type: id, name, category, description, price (in cents), weight, unit, stockQty, imageUrl, available
- `Category` type: id, name (e.g. Saltwater Fish, Freshwater Fish, Shellfish, Crabs & Lobsters, Smoked & Dried)
- `CartItem` type: productId, quantity
- `Order` type: id, customerId, items (list of OrderItem), deliveryAddress, customerName, customerPhone, totalAmount, status, createdAt
- `OrderItem` type: productId, productName, quantity, priceAtPurchase
- `OrderStatus` variant: #Pending, #Confirmed, #OutForDelivery, #Delivered, #Cancelled
- Queries: getProducts, getProduct, getCategories, getMyOrders, getAllOrders (admin), getStats (admin), getCustomers (admin)
- Updates: addProduct, updateProduct, deleteProduct (admin), placeOrder, updateOrderStatus (admin), updateMyProfile

### Frontend
- Customer pages: Home/catalog, product detail, cart (sidebar/drawer), checkout, my orders, order detail
- Admin pages: /admin dashboard, /admin/products, /admin/orders, /admin/customers
- Navigation: top navbar with cart icon and login; admin nav sidebar
- Authorization guard for admin routes
- Seed sample fish products with categories
