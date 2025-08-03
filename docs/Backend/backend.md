
# Backend Development Notes

Initially, I planned to build the server in JavaScript since Node.js works perfectly with JS. However, I switched to TypeScript for extra type safety and a more professional codebase. My goal is to keep the code clean, lean, and follow OOP principles wherever possible.

---

##  Useful Resources

- [How to use TypeScript in an Express app](https://dev.to/wizdomtek/typescript-express-building-robust-apis-with-nodejs-1fln)
- [How to use nodemon with Express & TypeScript](https://medium.com/@aren.talb00/building-an-express-app-with-typescript-and-nodemon-9bd8a809cc68)

---

##  Issues & Solutions faced during development

**Error:**
```
Could not find a declaration file for module 'cors'. '.../node_modules/cors/lib/index.js' implicitly has an 'any' type.
```
**Solution:**
Run the following command to install type definitions for cors:

```bash
npm i --save-dev @types/cors
```

---
