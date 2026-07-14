# ElectroMart

A full-stack e-commerce demo built with React 19, Redux Toolkit, React Router, and JSON Server, styled with pure CSS and paid for (in test mode) with Razorpay.

## Tech Stack

- **Frontend:** React 19, Vite, Redux Toolkit, React Router DOM, Axios, React Toastify, React Icons
- **Backend (temporary):** JSON Server (`db.json`)
- **Auth:** LocalStorage-based session persistence, protected routes for customers and admins
- **Payments:** Razorpay in **Test Mode**
- **Styling:** Pure CSS with CSS variables, Flexbox, Grid, and animations — no CSS framework

## Getting Started

```bash
npm install

# Terminal 1 — start the JSON Server API on http://localhost:4000
npm run server

# Terminal 2 — start the Vite dev server on http://localhost:5173
npm run dev
```

Open http://localhost:5173 in your browser.

## Demo Accounts

| Role     | Email                   | Password    |
|----------|-------------------------|-------------|
| Customer | asha@example.com        | password123 |
| Admin    | admin@electromart.com   | admin123    |

You can also register new customer or admin accounts from the app.

## Payments

Checkout uses the **Razorpay Test Mode** checkout widget with the standard public test key. On the payment screen, use these test card details:

- **Card number:** 4111 1111 1111 1111
- **Expiry:** any future date
- **CVV:** any 3 digits
- **OTP:** 1111 (or leave blank if not prompted)

No real money is ever charged. You can also choose **Cash on Delivery** at checkout to skip the payment step entirely.

## Project Structure

```
src/
  admin/          Admin panel pages (Dashboard, Products, Orders, Users, Categories, Profile, Login, Register)
  components/
    auth/         ProtectedRoute, AdminProtectedRoute
    common/       Button, Input, Modal, Loader, EmptyState, SearchBar
    home/         Hero, Categories, FlashDeals, Brands
    product/      ProductCard (single source of truth), ProductGrid, ProductBadge
    layout/       Navbar, Footer, MainLayout
    admin/        AdminSidebar, AdminTopbar, AdminLayout, StatCard, RevenueChart, AdminTable.css
  pages/          Home, Products, ProductDetails, Cart, Wishlist, Checkout, Orders, OrderSuccess, Login, Register, Contact, Profile, NotFound
  redux/
    store.js
    slices/       authSlice, productSlice, cartSlice, wishlistSlice, orderSlice
  services/       api.js, authService.js, productService.js, adminService.js, orderService.js, userService.js
  utils/          formatters.js, constants.js
  hooks/          useRazorpay.js
  styles/         tokens.css (design system), global.css (reset + utilities)
db.json           JSON Server database (products, categories, users, admins, orders)
```

## Notable Behaviors

- **Single ProductCard:** every page (Home, Products, Wishlist, Related Products) renders the same `ProductCard` component — there is no duplication.
- **Buy Now vs Cart Checkout:** "Buy Now" navigates straight to `/checkout` with the product passed via React Router state and never touches the cart. Checking out from the cart purchases every cart item and clears the cart afterward.
- **Persisted state:** auth session, cart, and wishlist are persisted to `localStorage` and rehydrated on load.
- **Protected routes:** `/checkout`, `/orders`, `/order-success`, and `/profile` require a customer login; all `/admin/*` pages (other than login/register) require an admin login.

## Production Build

```bash
npm run build
npm run preview
```

Note: `json-server` is a development-only mock backend and is not intended for production deployments.
