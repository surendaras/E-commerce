# Cartify — E-commerce Frontend (React + Vite)

This repository contains the frontend for the Cartify e-commerce demo application. It is built with React 18 and Vite, and includes a JWT-style client-side authentication demo with role-based access control (buyer / seller / admin).

## Quick overview

- Framework: React 18 (Vite)
- Router: react-router-dom v6
- State: Context API (Auth, Cart, Orders)
- Token: Client-side JWT-style tokens stored in `localStorage` (demo only)

## Prerequisites

1. Node.js (v16 or later recommended)
2. npm (or yarn)

## Setup — Install dependencies

1. Open a terminal in this folder (Frontend).
2. Install packages:

```bash
npm install
```

## Run in development

Start the dev server (hot reload):

```bash
npm run dev
```

Open your browser at the URL shown by Vite (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

To locally preview the production build:

```bash
npm run preview
```

## Available npm scripts

- `npm run dev` — Start development server
- `npm run build` — Build production assets
- `npm run preview` — Preview production build locally

## Project structure (important files)

- `src/` — Application source
	- `src/main.jsx` — App bootstrap
	- `src/App.jsx` — Routes and ProtectedRoute usage
	- `src/Context/` — Auth, Cart, Order providers and stores
	- `src/Pages/` — Page components (Shop, Product, Cart, Orders, dashboards)
	- `src/Components/` — Reusable UI components (Navbar, Item, Footer)

## Authentication & demo accounts

This app uses a demo JWT-style token (client-side) to demonstrate role-based behavior. Tokens are stored in `localStorage` under `cartify-auth-token`.

Demo accounts:

- Buyer: `buyer@gmail.com` / `buyer`
- Seller: `seller@gmail.com` / `seller`
- Admin: `admin@gmail.com` / `admin`

Behavior by role:

- Buyer: Full shopping flow — can add to cart, access `/cart` and `My Orders`.
- Seller: View products only (purchase disabled). Access `/seller` dashboard for order management.
- Admin: View products only (purchase disabled). Access `/admin` dashboard for fulfillment tasks.

## Notes about security

This project is a frontend demo. The token handling and role checks are implemented client-side for demonstration and are NOT secure. Do not use this method for real production auth. For production apps, implement server-side authentication and authorization and secure token handling (HTTP-only cookies or secure storage, server verification).

## Contributing

1. Create an issue describing the change.
2. Create a branch for your work.
3. Open a pull request with a clear description and tests (if applicable).

## Troubleshooting

- If the dev server fails to start, ensure Node and npm versions are compatible and run `npm install` again.
- If images or assets are missing after build, ensure `public/` assets are present and paths are correct.

## License

This project is a demo. Add a license file if you plan to reuse the code.

