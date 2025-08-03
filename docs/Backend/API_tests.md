

# Restaurant API Endpoints

Welcome to the Ommitus Restaurant API documentation! Here you'll find all the endpoints you need to manage restaurants, accounts, and more. Each API is listed with its method, URL, use, and current status.

---

## Admin Access APIs

| Name                | Method | URL                                         | Use                                               | Status            |
|---------------------|--------|---------------------------------------------|---------------------------------------------------|-------------------|
| Get All Restaurants | GET    | http://localhost:3000/api/restaurant/all    | Get list of all restaurants with accounts         | Production Ready  |

---

## Restaurant Access APIs

| Name                        | Method | URL                                                      | Use                                   | Status            |
|-----------------------------|--------|----------------------------------------------------------|---------------------------------------|-------------------|
| Create Account              | POST   | http://localhost:3000/api/restaurant/create-account      | Register a new restaurant             | Production Ready  |
| Login Account               | POST   | http://localhost:3000/api/restaurant/login               | Restaurant login                      | Production Ready  |
| Forgot Password             | PUT    | http://localhost:3000/api/restaurant/forgot-password     | Reset restaurant password             | Production Ready  |
| Get Info                    | GET    | http://localhost:3000/api/restaurant/get-info/:id        | Get restaurant info by ID             | Production Ready  |
| Update Data                 | PUT    | http://localhost:3000/api/restaurant/update/:id          | Update restaurant data by ID          | Production Ready  |
| Get Restaurant by Token     | GET    | http://localhost:3000/api/restaurant/token/:token        | Get restaurant by token               | Production Ready  |

---

> Replace `:id` and `:token` with actual values when making requests.

---

Feel free to add more endpoints or update the status as your API evolves!
