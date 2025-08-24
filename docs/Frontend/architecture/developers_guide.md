# Ommitus Developer Guide

Welcome devs, This is Saumya. Here’s the guide for anyone working on **Ommitus** in the future.

**Note on terms**:

* When I say **user**, I mean *restaurant owners* using our service.
* When I say **customer**, I mean *restaurant's customers* who scan the QR code to access the menu.

Every frontend file has a commented template at the top to guide AI. Example:

```tsx
{/*
  file path:  web/frontend/src/app/path/to/page.tsx
  Note     :  information about the code and its logic
  route    :  `/route/to/page`
 */}
```

---

## Data Flow

1. **Restaurant Auth (CRU)** → `/auth`
2. **Restaurant Business Logics (CRUD)** → `/restaurant`
3. **Customer accessing menus (Read only)** → `/customer`
4. **Customer rating dishes (CR)** → `/customer/:restaurantName/:dishId/ratings`

---

## 1. Restaurant Auth

### `/auth/get-started` → Sign-up & Login

**Sign-up flow**:

* User provides: `restaurantName`, `ownerName`, `email`, `password`.
* Backend generates a token: `(restaurantName + Date.now())`.
* Password is hashed in backend.
* Token, `restaurantName`, and `restaurantId` are saved in browser cookies.
* Check the actual logic → `/web/backend/src/routes/restaurant.route.ts` → `// Route to create an account`.

**Login flow**:

* User provides: `restaurantName`, `password`.
* Backend generates token: `(restaurantName + Date.now())`.
* Password is hashed in backend.
* Token, `restaurantName`, and `restaurantId` are saved in browser cookies.
* Check the actual logic → `/web/backend/src/routes/restaurant.route.ts` → `// Route to login`.

---

### `/auth/forgot-password` → Change password

* Takes `email`, `password`, and `newPassword`.
* For now, it just updates directly. In future → will switch to email-based auth for password reset.
* New password is hashed in backend.
* Check the actual logic → `/web/backend/src/routes/restaurant.route.ts` → `// Route to forgot password`.

---

## 2. Restaurant Business Logics

### `/restaurant/:id` → Provide and Update extra restaurant details

* Fields: `categories`, `address`, `since`, `phoneNumber`, `createdAt`.
* **Note:** `restaurantName` and `email` **cannot** be changed (future premium plan may allow).
* Uses cookies (`restaurantId`, `restaurantName`) that is being saved in browser during auth process.
* 2 APIs called:

  1. `GET http://localhost:3000/api/restaurant/get-info/${restaurantId}` → fetch info.
  2. `PUT http://localhost:3000/api/restaurant/update/${restaurantId}` → update info.
* Both APIs need a private key (`xkc`), see `/web/backend/.example.env`.
* Check the actual logic → `/web/backend/src/routes/restaurant.route.ts` → `// get info` and `// update data`.

---

### `/restaurant/:id/create` → Create/host dishes in menu

This page handles addition of dishes in menu. It uses 3 APIs:

1. **Fetch categories**:

   * `GET http://localhost:3000/api/restaurant/get-all-categories/${restaurantId}`
   * Needs `xkc` in headers.
2. **Upload dish image (Supabase)**:

   * Uses native Next.js API → `/app/api/upload-img/route.ts`.
   * Uploads image → returns public URL.
3. **Upload dish details (server)**:

   * `POST http://localhost:3000/api/menu/add-menu`
   * Needs `xkc` (secret private key) + `xrid` (restaurantId) in headers.

**Flow of the page**:

* On load → fetch restaurant categories (API 1).
* User creates dish → fills in `dishName`, `image`, `description`, etc.
* If an image is uploaded → it’s sent to Supabase (API 2) → returns public URL.
* Then dish details + image URL are sent to server (API 3) → stored in DB.


