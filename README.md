# Smart Inventory & Supply Chain Management

MERN demonstration implementation for Review 1: products, warehouses, inventory movements, purchase orders and dashboards.

## Run

1. Copy `server/.env.example` to `server/.env`, configure MongoDB and JWT secret.
2. `cd server && npm install && npm run dev`
3. `cd client && npm install && npm run dev`
4. Create the first administrator: `cd server && npm run seed` with `SEED_ADMIN_PASSWORD` in `.env`.

MongoDB replica-set deployment is recommended for production transactions. This repository contains application source, not verified production deployment.
