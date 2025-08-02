import express, { Request, Response } from 'express';
import { restaurantData } from "../schema/restaurant.schema";
import bcrypt from "bcrypt";

const router = express.Router();

// Route to create an account
router.post('/create-account', async (req: Request, res: Response) => {
  console.log("creating account...");

  try {
    const { restaurantName, password, email } = req.body;

    // check if restaurant is already registered:
    const check = await restaurantData.findOne({ restaurantName });
    if (check) {
      return res.status(300).send({
        success: false,
        message: "Account Already Exist"
      })
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate token 
    const newName = restaurantName.replace(/\s+/g, '');
    const token = `${newName + Date.now()}`;

    // Create a new restaurant document
    const data = new restaurantData({
      restaurantName,
      password: hashedPassword,
      email,
      token: token
    });
    const response = await data.save();

    res.status(200).send({
      message: 'Account created successfully',
      data: response,
    });

  } catch (error) {
    if ((error as any).code == 11000) {
      res.status(400).send({
        message: "Provided email is already registered, please try another email"
      })
    }

    else {
      res.status(400).send({
        message: "Error in creating account",
        error: error
      });
    }

  }
});

// Route to login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { restaurantName, password } = req.body;

    // validating response
    if (!restaurantName || !password) {
      return res.status(400).send({
        message: "All Details required",
      });
    };

    // Find the user
    const user = await restaurantData.findOne({ restaurantName: restaurantName });
    if (!user) {
      return res.status(404).send({
        message: "No account found with the provided details.",
      });
    };

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password." });
    }

    // send data
    const restaurant = await restaurantData.findOne({ restaurantName: restaurantName }, { restaurantName: 1, token: 1 })
    res.status(200).send({
      message: `Welcome back, ${user.restaurantName}!`,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error during login.",
      error: error instanceof Error ? error.message : "an error occured while trying to login",
    });
  }
});

export default router;