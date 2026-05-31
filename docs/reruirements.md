# Habesha Market — Requirements Document

**Project Name:** Habesha Market  
**Version:** 1.0  
**Author:** Hanan Umer 
**Date:** 2026-05-31  
**Duration:** 7-10 days 

---

## 1. Project Overview

Habesha Market is a beginner-friendly e-commerce web platform 
where customers can browse Ethiopian/Habesha products, add 
items to a cart, place orders, and track their purchases. 

The system supports three user roles: Customer, Seller, and Admin.

---

## 2. Project Objectives

- Allow customers to easily discover and buy local products.
- Give sellers a simple dashboard to list and manage products.
- Provide admins with control over users, products, and platform health.
- Build a clean, responsive, and secure platform.

---

## 3. Target Users

| Role     | Description                                          |
|----------|------------------------------------------------------|
| Customer | Anyone who wants to browse and buy products.         |
| Seller   | A vendor who lists and sells products on the platform.|
| Admin    | The platform owner who oversees the entire system.   |

---

## 4. Functional Requirements

### 4.1 Authentication
- Users can register with name, email, and password.
- Users can log in and receive a JWT token.
- Users can log out.
- Passwords must be securely hashed (bcrypt).
- Role-based access: customer, seller, admin.

### 4.2 Customer Features
- View list of all products on homepage.
- Search products by name.
- Filter products by category and price.
- View detailed product page.
- Add products to cart.
- Update cart quantity / remove items.
- Checkout and place an order.
- View past order history.
- Track order status (pending → shipped → delivered).

### 4.3 Seller Features
- Register as a seller / create seller profile.
- Add new products (name, price, stock, image, category).
- Update or delete own products.
- View list of own products.
- View orders that contain their products.
- Update inventory (stock count).

### 4.4 Admin Features
- View and manage all users (block, delete).
- View and manage all products (remove inappropriate ones).
- View platform statistics (total users, sales, orders).
- Promote/demote user roles if needed.

### 4.5 Order Management
- Customers can place orders from their cart.
- Each order stores items, total price, and status.
- Order status can be updated by seller/admin.
- Customers can view order details and history.

---

## 5. Non-Functional Requirements

| Category        | Requirement                                          |
|-----------------|------------------------------------------------------|
| Performance     | Pages should load in under 3 seconds.                |
| Security        | Use JWT auth, hashed passwords, input validation.    |
| Usability       | Simple, clean UI — mobile and desktop friendly.      |
| Scalability     | Backend should support adding more features later.   |
| Availability    | System should be available 99% of the time.          |
| Maintainability | Code follows clean structure (modular NestJS).       |

---

## 6. Technology Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Frontend     | Next.js, Tailwind CSS, Axios     |
| Backend      | NestJS (Node.js + TypeScript)    |
| Database     | PostgreSQL                       |
| ORM          | TypeORM               |
| Auth         | JWT + bcrypt                     |
| Deployment   | Vercel (frontend) + Render (backend) |
| Version Ctrl | Git + GitHub                     |

---

## 7. Scope

### ✅ In Scope (will build)
- User registration/login with JWT
- Product browsing, search, filtering
- Shopping cart and checkout
- Order placement and tracking
- Seller and admin dashboards
- Role-based access control

### ❌ Out of Scope (NOT in v1.0)
- Online payment integration (Stripe/PayPal) — manual/cash on delivery for now
- Real-time chat between buyer & seller
- Mobile native app (only web)
- Multi-language support (English only for v1.0)
- Product reviews and ratings (maybe v2.0)
- Email notifications (maybe v2.0)

---

## 8. Assumptions

- Users have a stable internet connection.
- Sellers will provide their own product images.
- The platform initially operates in one country/region.
- Payments are handled offline for v1.0.

---

## 9. Constraints

- Project must be completed in 5 days.
- Built by a single developer.
- Limited budget — use free tiers for hosting.
- Beginner-level project — keep complexity manageable.

---

## 10. Success Criteria

The project is considered successful when:
 ✅ A customer can register, browse, add to cart, and place an order.
 ✅ A seller can list and manage their products.
 ✅ An admin can manage users and view statistics.
 ✅ The system is deployed and accessible online.
 ✅ Code is on GitHub with clear documentation.

---

## 11. Future Enhancements (v2.0 Ideas)

- Payment gateway integration (Chapa, Stripe, Telebirr)
- Product reviews & star ratings
- Wishlist feature
- Email/SMS notifications
- Multi-language support (Amharic, English, Tigrinya)
- Mobile app (React Native)
- AI-powered product recommendations

---