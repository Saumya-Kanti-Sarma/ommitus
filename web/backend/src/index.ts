import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import cors from "cors";
import restaurantRoutes from "./routes/restaurant.route";
configDotenv();
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  const ApiKey = req.headers["apikey"];
  if (!ApiKey || ApiKey != process.env.API_KEY) res.status(401).json({ status: 401, message: "Access not allowed" })
  else next();
})

// Routes
app.use("/api/restaurant/", restaurantRoutes);
app.get('/api/health', (_, res: Response) => {
  res.status(201).send("Health Ok!");
});

mongoose.connect(`${process.env.MONGO_URL}`)
  .then(() => console.info("Connected to Database"))
  .catch((error) => console.error(`Cannot connect to database. Error: ${error}`))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});