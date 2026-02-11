import mongoose from "mongoose";

const fitnessSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true}, 
    discount: {type: Number, default: 0}
})

const fitnessModel = mongoose.models.fitness || mongoose.model("fitness", fitnessSchema);
export default fitnessModel;