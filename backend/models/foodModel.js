import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:String, required:true},
    category: {type:String, required:true},
    
    // 👇 دي الإضافات الجديدة اللي كانت ناقصة
    offer: {type: Boolean, default: false},
    discount: {type: Number, default: 0},
    variants: {type: Array, default: []}, // عشان الأحجام
    includes: {type: String, default: ""} // عشان المشتملات
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;