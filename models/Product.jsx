import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: {type: [String]}
});

// Check if the model already exists before creating a new one
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);