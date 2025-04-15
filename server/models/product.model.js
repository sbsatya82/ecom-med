import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: [String],
    default: []
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    }
  ],
  subCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SubCategory'
    }
  ],
  unit: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  discount: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    default: ""
  },
  more_details: {
    type: Map,
    of: String,
    default: {}
  },
  publish: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create text index with weights
productSchema.index(
  { name: "text", description: "text" },
  {
    weights: {
      name: 10,
      description: 5
    }
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
