import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },           // اسم الوصفة (مثلاً: طريقة عمل المكرونة بالبشاميل)
    description: { type: String, required: true },    // وصف يشد تحت الصورة
    image: { type: String, required: true },          // صورة الطبق النهائي
    video: { type: String, required: true },          // ملف الفيديو (اللي هيترفع)
    
    price: { type: Number, required: true },          // سعر "بوكس التحضير" (المكونات كلها)
    videoPrice: { type: Number, default: 50 },        // سعر اشتراك الفيديو (50 جنية زي ما طلبت)
    
    // المكونات (قايمة فيها اسم المكون وسعره)
    ingredients: { type: Array, required: true },     
    
    // طريقة التحضير (خطوات مكتوبة) عشان اللي مش عايز يدفع للفيديو يشوف الكتابة بس (أو تخفيها براحتك)
    steps: { type: String, required: true },          
    
    category: { type: String, default: "DIY" }        // علامة عشان نميزها إنها وصفة مش أكل جاهز
})

// السطر ده مهم عشان لو الموديل اتعمل قبل كده ميعملش مشاكل
const recipeModel = mongoose.models.recipe || mongoose.model("recipe", recipeSchema);

export default recipeModel;