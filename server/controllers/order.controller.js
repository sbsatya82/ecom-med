import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import UpiOrder from "../models/upiOrder.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId;
    const { list_items, addressId, payment_status} = request.body;

    if (!list_items || list_items.length === 0) {
      return response.status(400).json({
        message: "Cart is empty",
        error: true,
        success: false,
      });
    }

    const payload = list_items.map((el) => {
      const quantity = el.quantity || 1;
      const product = el.productId;

      // ✅ Calculate discounted price if discount exists
      let actualPrice = product.price;
      if (product.discount && product.discount > 0) {
        actualPrice = product.price - (product.price * product.discount / 100);
      }

      const itemTotal = actualPrice * quantity;

      return {
        userId: userId,
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product._id,
        product_details: {
          name: product.name,
          image: product.image,
        },
        quantity: quantity,
        paymentId: "",
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: itemTotal,
        totalAmt: itemTotal, // you can include tax/delivery charges here if needed
        invoice_receipt: "",
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return response.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
// save upi orders
export async function upiOrderController(request, response) {
  try {
    const { name, tnxId, orderId } = request.body;

    if (!name || !tnxId || !orderId) {
      return response.status(400).json({
        message: "All fields (name, tnxId, orderId) are required",
        error: true,
        success: false,
      });
    }

    // Check if orderId exists in OrderModel
    const existingOrder = await OrderModel.findById(orderId);
    if (!existingOrder) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // Save the UPI order
    const newUpiOrder = new UpiOrder({
      name,
      tnxId,
      orderId,
    });

    await newUpiOrder.save();

    return response.status(201).json({
      message: "UPI order stored successfully",
      data: newUpiOrder,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}


export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
  const actualPrice = Number(price) - Number(discountAmout)
  return actualPrice
}

export async function paymentController(request, response) {
  try {
    const userId = request.userId // auth middleware 
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body

    const user = await UserModel.findById(userId)

    const line_items = list_items.map(item => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id
            }
          },
          unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1
        },
        quantity: item.quantity
      }
    })

    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    }

    const session = await Stripe.checkout.sessions.create(params)

    return response.status(200).json(session)

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}


const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = []

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product)

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      }

      productList.push(paylod)
    }
  }

  return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

  console.log("event", event)

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
          lineItems: lineItems,
          userId: userId,
          addressId: session.metadata.addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status,
        })

      const order = await OrderModel.insertMany(orderProduct)

      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          shopping_cart: []
        })
        const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId })
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}


export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId // order id

    const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address')

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}



export async function getAllOrders(request, response) {
  try {
    const orderList = await OrderModel.find();
    return response.status(200).json({
      message: "order list get successfully",
      data: orderList,
      error: false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}



//set order status
export async function setOrderStatus(request, response) {
  try {
    const { status, orderId } = request.body;
    if (!status || !orderId) {
      return response.status(400).json({
        message: "Status and Order ID are required",
        success: false,
        error: true,
      });
    }
    const order = await OrderModel.findOne({ orderId });

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    order.status = status;
    await order.save();

    return response.status(200).json({
      message: "Order status updated successfully",
      success: true,
      error: false,
      data: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}