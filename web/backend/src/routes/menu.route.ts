import express, { Request, Response } from "express"
import { menuData } from "../schema/menu.schema";
import { restaurantData } from "../schema/restaurant.schema";
const router = express.Router();

// Create menu items
router.post("/add-menu", async (req: Request, res: Response) => {
  try {
    const id = req.headers["xrid"];
    const { dishName, image, available, category, veg, description, fullPlate, halfPlate } = req.body;
    const { addMany } = req.query;

    const restaurant = await restaurantData.findById(id, { _id: 1, categories: 1 });
    if (!restaurant) {
      return res.send({
        message: "invalid restaurant ID, please check the ID you have provided"
      });
    }

    if (addMany === "true") {
      if (!Array.isArray(req.body)) {
        return res.status(400).send({ message: "Body must be an array when addMany=true" });
      }
      // Validate categories 
      for (const item of req.body) {
        if (item.category && !restaurant.categories.includes(item.category)) {
          return res.status(404).send({ message: `Category "${item.category}" is not available.` });
        }
      }

      // Attach restaurantId to each item
      const menuItems = req.body.map(item => ({
        ...item,
        restaurantId: restaurant._id,
      }));

      const response = await menuData.insertMany(menuItems);
      return res.status(200).send({
        message: "menus added successfully",
        data: response
      });
    }

    // Single insert (default)
    if (category && !restaurant.categories.includes(category)) {
      return res.status(404).send({ message: "no category is available." });
    }

    const data = new menuData({ restaurantId: restaurant._id, dishName, available, image, category, veg, description, fullPlate, halfPlate });
    const response = await data.save();

    res.status(200).send({
      message: "menu added successfully",
      data: response
    });
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occurred"
    });
  }
});

// Read all menu items /all?available=true&category=<category>&page=1&limit=5
router.get("/all", async (req: Request, res: Response) => {
  try {
    const id = req.headers["xrid"];
    const { available, category, page = 1, limit = 7 } = req.query;
    if (available) {
      const data = await menuData.find({ restaurantId: id, available: available }, { description: 0, restaurantId: 0, __v: 0 });
      return res.status(200).send({
        data
      })
    };

    if (category) {
      const data = await menuData.find({ restaurantId: id, category: category }, { description: 0, restaurantId: 0, __v: 0 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit)).sort({ createdAt: -1 });
      return res.status(200).send({
        data
      });
    };

    if (available && category) {
      const data = await menuData.find({ restaurantId: id, available: available, category: category }, { description: 0, restaurantId: 0, __v: 0 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit)).sort({ createdAt: -1 });
      return res.status(200).send({
        data
      });
    };
    const data = await menuData.find({ restaurantId: id }, { description: 0, restaurantId: 0, __v: 0 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit))

    res.status(200).send({
      data
    })
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  }
});

// Read one menu items
router.get("/:menuID", async (req: Request, res: Response) => {
  try {
    const menuId = req.params.menuID;
    const data = await menuData.findById(menuId)
    res.status(200).send({
      data
    })
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  }
})

// update menu
router.put("/:menuID", async (req: Request, res: Response) => {
  try {
    const menuID = req.params.menuID;
    const { dishName, available, image, category, veg, description, fullPlate, halfPlate } = req.body;
    interface updatetypes {
      dishName: String,
      available: String,
      image: [String],
      category: String,
      veg: boolean,
      description: String,
      fullPlate: Number,
      halfPlate: Number
    }
    const updatedata: Partial<updatetypes> = {};

    if (dishName) updatedata.dishName = dishName;
    if (available) updatedata.available = available;
    if (image) updatedata.image = image;
    if (category) updatedata.category = category;
    if (veg) updatedata.veg = veg;
    if (description) updatedata.description = description;
    if (fullPlate) updatedata.fullPlate = fullPlate;
    if (halfPlate) updatedata.halfPlate = halfPlate;

    const data = await menuData.findByIdAndUpdate(menuID, updatedata, { $new: true })
    if (!data) return res.status(404).send({
      message: "No data was updated, please try again"
    });
    res.status(200).send({
      message: "data updated successfully",
      data: updatedata
    })
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  }
})

// delete menu
router.delete("/:menuID", async (req: Request, res: Response) => {
  try {
    const id = req.params.menuID;
    const data = await menuData.findOneAndDelete({ _id: id });
    if (!data) return res.status(404).send({ message: "no menu was found" });
    res.status(200).send({
      message: "menu deleted successfully!"
    })
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : "unknown error occured"
    });
  }

})
export default router