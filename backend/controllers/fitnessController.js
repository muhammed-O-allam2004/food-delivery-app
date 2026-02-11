import fitnessModel from "../models/fitnessModel.js";
import fs from 'fs';

const addFitnessItem = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const fitness = new fitnessModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        discount: req.body.discount,
        image: image_filename
    })
    try {
        await fitness.save();
        res.json({success: true, message: "Fitness Food Added"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

const listFitnessItems = async (req, res) => {
    try {
        const foods = await fitnessModel.find({});
        res.json({success: true, data: foods})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

const removeFitnessItem = async (req, res) => {
    try {
        const food = await fitnessModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {}) 
        await fitnessModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Fitness Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

export { addFitnessItem, listFitnessItems, removeFitnessItem }