import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: "Product",
        required: true
      }
    ],
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      phone: {
        type: Number,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    numberOfPieces: {
      type: Number,
      required: true
    },
    itemsPrice: {
      type: Number,
      required: true
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: function () {
        const perPiecePrice = process.env.SHIPPING_PER_PIECE_PRICE;
        const calculatedShippingPrice = this.numberOfPieces * perPiecePrice;
        return calculatedShippingPrice;
      }
    },
    taxPrice: {
      type: Number,
      required: true,
      default: process.env.TAX_PRICE
    },
    totalPrice: {
      type: Number,
      required: true,
      default: function () {
        return (this.itemsPrice * this.numberOfPieces) + this.taxPrice + this.shippingPrice;
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    delivery: {
      deliverymanID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
      deliverymanStatus: { type: Boolean, default: false, required: false },
      deliveredAt: { type: Date, required: false },
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    isDelivered: {
      type: Boolean,
      required: false,
      default: false
    },
    paidAt: {
      type: Date
    },
    orderStatus: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;