# Hescom Backend (Node + Express + MongoDB)

A standalone REST API for the Hescom/Nirmag storefront. It replaces the static
JSON files in `public/data/` with real endpoints backed by MongoDB.

## 1. Install & run

```bash
cd hescom-backend
npm install
cp .env.example .env        # then edit MONGO_URI / JWT_SECRET
npm run seed                # loads products/categories/brands into MongoDB
npm run dev                 # starts on http://localhost:5000
```

You need a MongoDB instance — either local (`brew install mongodb-community`
/ `mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster;
put its connection string in `MONGO_URI`.

## 2. Endpoints implemented

| Method | Route                      | Auth        | Purpose                     |
|--------|-----------------------------|-------------|------------------------------|
| POST   | /api/auth/register          | -           | create account               |
| POST   | /api/auth/login              | -           | login, returns JWT           |
| GET    | /api/auth/me                 | user        | current profile              |
| GET    | /api/products                | -           | list (filter/sort/paginate)  |
| GET    | /api/products/:slug          | -           | product detail               |
| POST/PUT/DELETE /api/products/:id | admin | manage products         |
| GET    | /api/categories              | -           | list categories              |
| POST/PUT/DELETE /api/categories/:id | admin | manage categories      |
| GET    | /api/brands                  | -           | list brands                  |
| POST/DELETE /api/brands/:id  | admin       | manage brands                |
| POST   | /api/orders                  | user        | checkout / create order      |
| GET    | /api/orders/mine             | user        | my orders                    |
| GET    | /api/orders                  | admin       | all orders                   |
| PUT    | /api/orders/:id/status       | admin       | update order/payment status  |

Models also exist for `Review` and `Coupon` (used by the admin reviews/coupons
pages) — add routes/controllers for these the same way as `brandController.js`
once you're ready to wire those admin screens up.

## 3. Connecting the Next.js frontend

1. In the Hescom project root, add to `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
2. Replace the static import in `app/lib/cms.ts` with real fetch calls, e.g.:
   ```ts
   export async function getProducts(params?: Record<string, string>) {
     const qs = params ? "?" + new URLSearchParams(params) : "";
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products${qs}`, {
       cache: "no-store",
     });
     if (!res.ok) throw new Error("Failed to fetch products");
     return res.json(); // { items, total, page, pages }
   }
   ```
   Do this per data type (products, categories, brands) and update the
   components/pages that currently import from `cms.ts` to call these
   functions (server components can `await` them directly; client
   components should fetch in a `useEffect` or via a data hook).
3. Auth: point `app/auth/page.tsx`'s login/register handlers at
   `POST /api/auth/login` and `/api/auth/register`. Store the returned
   `token` (e.g. in an httpOnly cookie set by a small Next.js route handler,
   or in memory + localStorage for a first pass) and send it as
   `Authorization: Bearer <token>` on subsequent requests.
4. Cart/Wishlist: these currently live in `localStorage` via
   `CartContext.tsx` / `WishlistContext.tsx` — that's fine to keep for guests.
   If you want carts to persist per logged-in user, add a `Cart` model/route
   the same way `Order` was built, and sync on login.
5. Admin panel (`app/admin/**`): swap `app/admin/lib/admin.ts` and the JSON
   under `app/admin/public/data/` for calls to `/api/products`,
   `/api/orders`, `/api/categories`, `/api/brands`, protected with the
   admin's JWT.

## 4. Production notes

- Set `NODE_ENV=production`, a strong random `JWT_SECRET`, and restrict
  `CORS_ORIGIN` to your real frontend domain.
- Put the API behind HTTPS (reverse proxy with Nginx/Caddy, or a platform
  like Render/Railway/Fly.io).
- Consider adding rate limiting (`express-rate-limit`) and request
  validation (`zod` or `joi`) before going live.
