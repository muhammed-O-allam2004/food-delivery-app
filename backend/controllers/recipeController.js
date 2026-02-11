import recipeModel from "../models/recipeModel.js";
import fs from 'fs';

// 1. إضافة وصفة جديدة (Add Recipe)
const addRecipe = async (req, res) => {
    
    // هنا بنجيب اسم الصورة واسم الفيديو من الطلب اللي جاي
    // لاحظ إننا بنستخدم req.files (جمع) عشان جايلنا ملفين
    let image_filename = `${req.files.image[0].filename}`;
    let video_filename = `${req.files.video[0].filename}`;

    const recipe = new recipeModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        videoPrice: req.body.videoPrice,
        category: req.body.category,
        steps: req.body.steps,
        image: image_filename,
        video: video_filename,
        // المكونات بتتبعت كـ نص (JSON) فلازم نفكها عشان تتخزن كـ مصفوفة
        ingredients: JSON.parse(req.body.ingredients) 
    })

    try {
        await recipe.save();
        res.json({success: true, message: "تم إضافة الوصفة والفيديو بنجاح 📹"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "حدث خطأ أثناء الحفظ"});
    }
}

// 2. عرض كل الوصفات (List Recipes)
const listRecipes = async (req, res) => {
    try {
        const recipes = await recipeModel.find({});
        res.json({success: true, data: recipes});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// 3. حذف وصفة (Remove Recipe)
const removeRecipe = async (req, res) => {
    try {
        const recipe = await recipeModel.findById(req.body.id);
        
        // نحذف الصورة والفيديو القدام من السيرفر عشان المساحة
        fs.unlink(`uploads/${recipe.image}`, () => {})
        fs.unlink(`uploads/${recipe.video}`, () => {})

        await recipeModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "تم حذف الوصفة"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

export { addRecipe, listRecipes, removeRecipe };