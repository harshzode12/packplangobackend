# Travel Backend - Node.js + Express + MongoDB

This is a ready-to-run REST API backend for a travel website.

## Setup

1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```
   npm install
   ```
3. Start server (dev):
   ```
   npm run dev
   ```
4. API base: `http://localhost:5000/api/...`

## Features
- Users (register/login)
- Packages (CRUD)
- Bookings (create/list/update)
- Deals (create/apply)
- Reviews (create/list)
- Rewards (create/list)
- JWT authentication + admin middleware
