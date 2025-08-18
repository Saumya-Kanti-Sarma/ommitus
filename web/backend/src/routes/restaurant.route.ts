import express, { Request, Response } from 'express';
import { restaurantData } from "../schema/restaurant.schema";
import bcrypt from "bcrypt";

const router = express.Router();

// ADMIN routes:
router.get("/all", async (req: Request, res: Response) => {
  const data = await restaurantData.find({}, { restaurantName: 1, email: 1, _id: 1, created: 1 })
  res.status(202).send({
    data
  })
})


// Route to create an account
router.post('/create-account', async (req: Request, res: Response) => {
  //console.log("creating account...");

  try {
    const { restaurantName, password, email, ownerName } = req.body;

    // check if restaurant is already registered:
    const check = await restaurantData.findOne({ restaurantName });
    if (check) {
      res.status(409).send({
        success: false,
        message: "Account Already Exist"
      })
    } else {
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
        ownerName,
        token: token
      });
      const response = await data.save();

      res.status(200).send({
        message: 'Account created successfully',
        data: response,
      });
      //console.log("account created");

    }

  } catch (error) {
    if ((error as any).code == 11000) {
      res.status(400).send({
        message: "Provided email is already registered, please try another email"
      });
      //console.log("cannot created");
    }

    else {
      res.status(400).send({
        message: "Error in creating account",
        error: error
      });
      //console.log("cannot created");
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

// forgot password
router.put("/forgot-password", async (req: Request, res: Response) => {
  const { email, password, newPassword } = req.body;

  try {
    // Validate input fields
    if (!email || !password || !newPassword) {
      res.status(400).send({ message: "All fields are required!" });
    }

    // Find the user by restaurantName and email
    const verifyUser = await restaurantData.findOne({ email }, { email: 1, password: 1 });
    if (!verifyUser) {
      res.status(404).send({ message: "User not found or details do not match!" });
    } else {
      // compare password
      const hashedPassword = await bcrypt.compare(password, verifyUser.password);
      if (!hashedPassword) {
        res.status(404).send({ message: "invalid password" });
      }
      else {
        const newHash = await bcrypt.hash(newPassword, 10)
        const data = await restaurantData.findByIdAndUpdate({ _id: verifyUser._id }, { password: newHash });

        res.status(202).send({
          message: "password updated successfully",
        })
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured",
    });
  }
});

// get info
router.get('/get-info/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const restaurant = await restaurantData.findById(id, {
      password: 0, __v: 0
    });
    if (!restaurant) {
      res.status(400).send({
        message: "cannot Find the restaurant"
      })
    }

    res.status(200).send({
      restaurantDetails: restaurant
    })


  } catch (error) {
    res.status(400).send({
      message: error instanceof Error ? error.message : "Unknown error occured while getting the data",
    })
  }
});

// update data
router.put('/update/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      restaurantName,
      ownerName,
      since,
      address,
      phoneNumber,
      about,
      categories,
    } = req.body;

    // Create an object for the fields to update
    interface dataTypes {
      restaurantName: string;
      ownerName: string;
      since: string;
      address: string;
      phoneNumber: string;
      about: string;
      categories: string[];
    }
    const updateData: Partial<dataTypes> = {};

    // Add other fields to the update object
    if (restaurantName) updateData.restaurantName = restaurantName;
    if (about) updateData.about = about;
    if (categories) updateData.categories = categories;
    if (address) updateData.address = address;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (ownerName) updateData.ownerName = ownerName;
    if (since) updateData.since = since;

    // Update the account
    const updatedAccount = await restaurantData.findByIdAndUpdate(
      id,
      updateData
    );

    // Handle case where the account does not exist
    if (!updatedAccount) {
      return res.status(404).send({ message: "Account not found." });
    }

    res.status(200).send({
      message: "Account updated successfully.",
      data: updateData,
    });
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "Error updating account.",
    });
  }
});


// route to search restaurant via CredentailToken
router.get('/token/:token', async (req: Request, res: Response) => {
  const token = req.params.token;
  try {
    const restaurant = await restaurantData.findOne({ token: token }, { _id: 1, restaurantName: 1, token: 1 });

    if (!restaurant) {
      return res.status(400).send({
        message: "Cannot find the restaurant"
      });
    }

    res.status(200).send({
      restaurant
    });

  } catch (error) {
    res.status(400).send({
      message: error instanceof Error ? error.message : "Cannot get info right now, please try later",
    });
  }
});

// Get all categories
router.get("/get-all-categories/:restaurantId", async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await restaurantData.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ categories: restaurant.categories });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving categories" });
  }
});

export default router;