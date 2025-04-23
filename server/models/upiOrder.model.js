import mongoose from "mongoose";

const upiOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tnxId: {
    type: String,
    required: true,
    unique: true
  },
  note: {
    type: String,
    default: ""
  },
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: true
  }
}, {
  timestamps: true
});

const UpiOrder = mongoose.model("UpiOrder", upiOrderSchema);

export default UpiOrder;
