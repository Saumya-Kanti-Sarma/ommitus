# Ommitus – SiteMap

Ommitus is structured into five main portals, each with its own route prefix:

* **Landing Portal** → `/`
* **Auth Portal** → `/auth`
* **Restaurant Portal** → `/restaurant`
* **Customer Portal** → `/customer`
* **Admin Portal** → `/admin` *(To be integrated after onboarding 5+ restaurants)*

---

## 1. Landing Portal (`/`)

| Route      | Description                |
| ---------- | -------------------------- |
| `/`        | Home landing page          |
| `/about`   | About us                   |
| `/pricing` | Pricing plans              |
| `/faq`     | Frequently asked questions |

---

## 2. Auth Portal (`/auth`)

| Route                   | Description              |
| ----------------------- | ------------------------ |
| `/auth/get-started`     | User registration & login        |
| `/auth/forgot-password` | Forgot password recovery |

---

## 3. Restaurant Portal (`/restaurant/:id`)

> `:id` refers to the unique restaurant ID (MongoDB ObjectID)

| Route                         | Description                                      |
| ----------------------------- | ------------------------------------------------ |
| `/restaurant/:id`             | Restaurant profile dashboard                     |
| `/restaurant/:id/create`      | Create new menu items                            |
| `/restaurant/:id/available`   | List of available menu items                     |
| `/restaurant/:id/unavailable` | List of unavailable menu items                   |
| `/restaurant/:id/qr-code`     | QR code page for menu access                     |
| `/restaurant/:id/stats`       | Restaurant stats (menu visits, top dishes, etc.) |

---

## 4. Customer Portal (`/customer/:restaurantName`)

> `:restaurantName` is used for clean, user-friendly URLs

| Route                                       | Description                    |
| ------------------------------------------- | ------------------------------ |
| `/customer/:restaurantName`                 | Restaurant landing page        |
| `/customer/:restaurantName/menu`            | Menu display                   |
| `/customer/:restaurantName/:dishId`         | Individual dish page           |
| `/customer/:restaurantName/:dishId/ratings` | Individual dish rating page    |

---

## 5. Admin Portal (`/admin`)

> *Planned for future implementation once scale is achieved.*

| Route    | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| `/admin` | Admin dashboard to monitor: daily traffic, best restaurants, UX metrics, etc. |

---

### Notes for Future Devs:

> "As ommitus is gonna have 4-5 different portals, I must structure each route wisely. Now Im working by my self but for future team, everything must be easy to understand.. See you in future buddies!"

