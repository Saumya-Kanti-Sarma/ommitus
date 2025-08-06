import { ratingsData } from "../schema/ratings.schema";
import { Request, Response, Router } from "express";

const router = Router();

{/*
  1. create rating
  2. read rating for a menu
  3. read rating for a restaurant
  4. delete rating for a restaurant  
  */}

// create ratings
router.post("/", async (req: Request, res: Response) => {
  try {
    const { dishID, restaurantID, review, customerName, stars, gender } = req.body;
    const data = new ratingsData({ dishID, restaurantID, review, customerName, stars, gender });
    await data.save();
    return res.status(200).send({
      message: "Ratings added"
    })

  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  };
});


router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 5, menuId, restaurantId } = req.query;
    if (menuId) {
      const data = await ratingsData.find({ dishID: menuId }, { dishID: 0, restaurantID: 0, __v: 0 }).skip((Number(page) - 1) * Number(limit)).sort({ createdAt: -1 });
      return res.status(200).send({
        data
      })
    };
    if (restaurantId) {
      const data = await ratingsData.find({ restaurantID: restaurantId }, { dishID: 0, restaurantID: 0, __v: 0, customerName: 0 }).skip((Number(page) - 1) * Number(limit)).sort({ createdAt: -1 });
      return res.status(200).send({
        data
      })
    };
    res.status(404).send({
      message: "No ratings was found"
    })

  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  };
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { restaurantID, ratingID, menuID } = req.body;
    const data = await ratingsData.findOneAndDelete({ _id: ratingID, restaurantID, dishID: menuID });
    if (data) return res.status(200).send({ message: "ratings deleted" });
    res.status(404).send({
      message: "No ratings was found"
    })
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  };
});


export default router;