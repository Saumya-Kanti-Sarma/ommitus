import express from 'express';
const router = express.Router();
import { restaurantData } from "../schemas/restaurant.schema.js";
import mongoose from 'mongoose';
import bcrypt from "bcrypt"

// Route to create an account
router.post('/create-account', async (req, res) => {
  try {
    const { restaurantName, password, email } = req.body; // remove parentheses

    // Hash the password, email, and address
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if restaurant is already registered:
    const checkRegistration = await restaurantData.findOne({ restaurantName });
    if (checkRegistration) {
      res.status(300).send({
        success: false,
        message: "Account Already Exist"
      })
    }
    if (!checkRegistration) {
      // generate token 
      const newName = restaurantName.replace(/\s+/g, '-');
      const token = `${newName + Date.now()}`;

      // Create a new restaurant document
      const data = new restaurantData({
        restaurantName,
        password: hashedPassword,
        email,
        token: token
      });
      const response = await data.save();

      // Use aggregation to exclude the password field
      const result = await restaurantData.aggregate([
        { $match: { _id: response._id } }, // Match the newly created document
        {
          $project: {
            restaurantName: 1,
            email: 1,
            token: 1,
          }
        }, // Exclude the password field
      ]);

      res.status(200).send({
        message: 'Account created successfully',
        data: result[0], // The result is returned as an array
      });

    }
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).send({
        message: "Provided email is already registered, please try another email"
      })
    }

    else {
      res.status(400).send({
        message: "Error in creating account",
        error: error,
        name: restaurantName,
        password: password
      });
    }

  }
});

// Route to login
router.post('/login', async (req, res) => {
  try {
    const { restaurantName, password } = req.body;

    if (!restaurantName || !password) {
      return res.status(400).send({
        message: "All Details required",
      });
    }
    else if (!restaurantName) {
      return res.status(400).send({
        message: "Restaurant name required",
      });
    }
    else if (!password) {
      return res.status(400).send({
        message: "password required",
      });
    }

    // Find the user
    const user = await restaurantData.findOne({ restaurantName: restaurantName });

    if (!user) {
      return res.status(404).send({
        message: "No account found with the provided details.",
      });
    }

    else {
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid password." });
      }

      // get the aggrigate data
      const aggrigateData = await restaurantData.aggregate([
        { $match: { _id: user._id } }, // Match the newly created document
        {
          $project: {
            restaurantName: 1,
            token: 1,
          }
        },
      ])


      // Respond with a success message and token
      res.status(200).send({
        message: `Welcome back, ${user.restaurantName}!`,
        data: aggrigateData[0]
        , // Return token for authentication
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error during login.",
      error: error.message,
    });
  }
});


router.post("/forgot-password", async (req, res) => {
  const { restaurantName, email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password || !restaurantName) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Find the user by restaurantName and email
    const verifyUser = await restaurantData.findOne({ restaurantName, email });
    if (!verifyUser) {
      return res.status(404).send({ message: "User not found or details do not match!" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password
    verifyUser.password = hashedPassword;
    await verifyUser.save(); // Save the updated document

    res.status(200).send({
      message: "Password changed successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred: " + error.message,
    });
  }
});


// get info
router.get('/get-info/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const restaurant = await restaurantData.findById(id);
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
      message: "cannot get info right now, please try later",
      error: error,
    })
  }
})


// update data
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      restaurantName,
      ownerName,
      since,
      address,
      phoneNumber,
      about,
      password,
      categories,
    } = req.body;

    // Validate the provided ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid account ID." });
    }

    // Create an object for the fields to update
    const updateData = {};

    // Hash password if it exists
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Add other fields to the update object
    if (restaurantName) updateData.restaurantName = restaurantName;
    if (about) updateData.about = about;
    if (categories) updateData.categories = categories;
    if (address) updateData.address = address;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (ownerName) updateData.ownerName = ownerName;
    if (since) updateData.since = since;

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({ message: "No update data provided." });
    }

    // Update the account
    const updatedAccount = await restaurantData.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to avoid overwriting the entire document
      { new: true, runValidators: true } // Return updated document and validate the data
    );

    // Handle case where the account does not exist
    if (!updatedAccount) {
      return res.status(404).send({ message: "Account not found." });
    }

    res.status(200).send({
      message: "Account updated successfully.",
      data: updatedAccount,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating account.",
      error: error.message,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      IV: process.env.IV,
    });
  }
});


// Route to delete an account
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAccount = await restaurantData.findByIdAndDelete(id);

    if (!deletedAccount) {
      return res.status(404).send({ message: "Account not found." });
    }

    res.status(200).send({
      message: "Account deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting account.",
      error: error.message,
    });
  }
});

// route to search restaurant via CredentailToken
router.get('/search/:token', async (req, res) => {
  const token = req.params.token;
  try {
    // Use .select() to only fetch the _id field
    const restaurant = await restaurantData.findOne({ token: token });

    if (!restaurant) {
      return res.status(400).send({
        message: "Cannot find the restaurant"
      });
    }

    res.status(200).send({
      restaurantID: restaurant._id,// Send only the _id
      restaurantName: restaurant.restaurantName,
    });

  } catch (error) {
    res.status(400).send({
      message: "Cannot get info right now, please try later",
      error: error.message,
    });
  }
});

// Add a new category
router.post("/:restaurantId/create-categories", async (req, res) => {
  const { restaurantId } = req.params;
  const { categories } = req.body; // Expecting an array of categories

  try {
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories must be a non-empty array" });
    }

    const restaurant = await restaurantData.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Add only new categories that don't already exist
    const newCategories = categories.filter((category) => !restaurant.categories.includes(category));
    restaurant.categories.push(...newCategories);

    await restaurant.save();

    res.status(200).json({
      message: `${newCategories.length} categories added successfully`,
      categories: restaurant.categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding categories", error: error.message });
  }
});

// Get all categories
router.get("/:restaurantId/get-all-categories", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await restaurantData.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ categories: restaurant.categories });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error: error.message });
  }
});

// Update a specific category
router.put("/:restaurantId/categories/:categoryName", async (req, res) => {
  const { restaurantId, categoryName } = req.params;
  const { newCategory } = req.body;

  try {
    const restaurant = await restaurantData.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const categoryIndex = restaurant.categories.indexOf(categoryName);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (restaurant.categories.includes(newCategory)) {
      return res.status(400).json({ message: "New category already exists" });
    }

    restaurant.categories[categoryIndex] = newCategory;
    await restaurant.save();

    res.status(200).json({ message: "Category updated successfully", categories: restaurant.categories });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

// Delete a specific category
router.delete("/:restaurantId/delete-categories/:categoryName", async (req, res) => {
  const { restaurantId, categoryName } = req.params;

  try {
    const restaurant = await restaurantData.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const categoryIndex = restaurant.categories.indexOf(categoryName);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    restaurant.categories.splice(categoryIndex, 1);
    await restaurant.save();

    res.status(200).json({ message: "Category deleted successfully", categories: restaurant.categories });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});


export default router;
