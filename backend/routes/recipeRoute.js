import express from "express";
import { addRecipe, listRecipes, removeRecipe } from "../controllers/recipeController.js";
import multer from "multer";

const recipeRouter = express.Router();

// 1. إعدادات تخزين الملفات (صور وفيديوهات)
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        // بنسمي الملف باسم مميز عشان ميتكررش + الامتداد بتاعه
        return cb(null, `${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

// 2. تعريف المسارات (Routes)

// مسار الإضافة: بيستقبل ملفين (صورة + فيديو)
recipeRouter.post("/add", upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'video', maxCount: 1 }
]), addRecipe);

// مسار العرض والحذف
recipeRouter.get("/list", listRecipes);
recipeRouter.post("/remove", removeRecipe);

export default recipeRouter;