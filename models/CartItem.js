import mongoose, { model, Schema, models } from "mongoose";

const CartItemSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    addedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const CartItem = models?.CartItem || model("CartItem", CartItemSchema);
