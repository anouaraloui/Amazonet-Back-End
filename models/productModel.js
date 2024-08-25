import mongoose from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

const reviewSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true,
        min: 0,
        max: 5 
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    image: { 
        type: String, 
        required: false 
    },
    brand: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String,
        enum: ["Electronics", "Computers", "Women's Fashion", "Men's Fashion", "Video Games", "Books"], 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    discount: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    totalPrice: {
        type: Number,
        requied: false,
        default: function () {
            return this.price - (this.price * this.discount / 100);
          },
        min: 0
    },
    countInStock: { 
        type: Number, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true 
    },
    numReviews: { 
        type: Number,
        required: true,
        default: 0 
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(uniqueValidator);

const Product = mongoose.model('Product', productSchema);

export default Product;