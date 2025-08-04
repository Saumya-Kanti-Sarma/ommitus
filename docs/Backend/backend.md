
# Backend Development Notes

Initially, I planned to build the server in JavaScript since Node.js works perfectly with JS. However, I switched to TypeScript for extra type safety and a more professional codebase. My goal is to keep the code clean, lean, and follow OOP principles wherever possible.

---

##  Useful Resources

- [How to use TypeScript in an Express app](https://dev.to/wizdomtek/typescript-express-building-robust-apis-with-nodejs-1fln)
- [How to use nodemon with Express & TypeScript](https://medium.com/@aren.talb00/building-an-express-app-with-typescript-and-nodemon-9bd8a809cc68)
- [Pagination with express and mongoose](https://dev.to/hakimraissi/pagination-with-express-and-mongoose-pnh)

---

##  Issues & Solutions faced during development

**Error:**
1. type error at ./index.ts
  ```
  Could not find a declaration file for module 'cors'. '.../node_modules/cors/lib/index.js' implicitly has an 'any' type.
  ```
  **Solution:**
  Run the following command to install type definitions for cors:

  ```bash
  npm i --save-dev @types/cors
  ```
2. Multiple response error at ./route/menu.route.ts 
  ```ts
  if (!restaurant) {
  return res.send({
    message: "invalid restaurant ID, please check the ID you have provided"
  })
  };
  if (category) {
    const checkCategory = restaurant.categories.includes(category);
    if (!checkCategory) res.status(404).send({ message: "no category is available." });
  };
  ```
  Error:
  ```
  "Cannot set headers after they are sent to the client"
  ```
  reason: code sometimes tries to send more than one response for a single request.
  How to fix:
  Add a return after sending a response, so the function exits and does not try to send another response.
  ```ts
  if (category) {
  const checkCategory = restaurant.categories.includes(category);
  if (!checkCategory) return res.status(404).send({ message: "no category is available." });
  }
  ```
---
