import express from "express";
import { ratingsData } from "../schemas/ratings.schema.js";
import { menuData } from "../schemas/menu.schema.js";
import mongoose from "mongoose";

const route = express.Router();

// Route to add a review for a dish
route.post("/add-review/:dishID", async (req, res) => {
  try {
    const { dishID } = req.params; // Access parameters directly
    const {
      review,
      customerName,
      stars,
      gender, } = req.body;
    // Validate request body
    if (!customerName || !dishID) {
      return res.status(400).send({
        message: "Customer name and dish ID are required.",
      });
    }
    const newReview = new ratingsData({
      customerName,
      dishID,
      review,
      stars,
      gender
    });

    const savedReview = await newReview.save();
    res.status(201).send({
      message: "Review added successfully.",
      data: savedReview,

    });

  } catch (error) {
    if (error.code === 11000) { // Handle duplicate key error
      res.status(400).send({
        message: "A rating already exists. Please update the existing rating instead.",
      });
    } else {
      res.status(500).send({ error: error });
    }
  }
});
// Route to delete a review for a dish
route.delete("/delete-review/:id", async (req, res) => {
  try {
    const { id } = req.params.id;

    const deletedReview = await ratingsData.findOneAndDelete({
      id
    });

    if (!deletedReview) {
      return res.status(404).send({
        message: "Review not found.",
      });
    }

    res.status(200).send({
      message: "Review deleted successfully.",
      data: deletedReview,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting review, please try again later.",
      error: error.message,
    });
  }
});

// Route to calculate the average stars for a specific dish
route.get("/average-stars/:dishID", async (req, res) => {
  try {
    const { dishID } = req.params;

    // Check if the dish exists
    const checkDishID = await menuData.findById(dishID);
    if (!checkDishID) {
      return res.send({
        success: false,
        message: "Cannot find any dish with this ID",
      });
    } else {
      // Convert dishID to ObjectId to ensure correct matching
      const result = await ratingsData.aggregate([
        { $match: { dishID: new mongoose.Types.ObjectId(dishID) } }, // Filter by dishID
        {
          $group: {
            _id: "$dishID",
            averageStars: { $avg: "$stars" }, // Calculate the average of the stars field
          },
        },
      ]);

      // If no ratings found, return a default response
      if (result.length <= 0) {
        return res.send({
          message: "No ratings found for this dish.",
          averageStars: 5,
        });
      }

      res.status(200).send({
        message: "Average stars calculated successfully.",
        dishID: result[0]._id,
        averageStars: result[0].averageStars,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error calculating average stars, please try again later.",
      error: error.message,
    });
  }
});
// route to get all ratings of a particular dish
route.get("/all-ratings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ratingsData.find({ dishID: id });
    res.status(200).send({
      success: true,
      data: response,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }


})
export default route;
