import mongoose, { Schema, model, models } from "mongoose";

const FavoriteItemSchema = new Schema({
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
  addedAt: { type: Date, default: Date.now },
});

export const FavoriteItem =
  models?.FavoriteItem || model("FavoriteItem", FavoriteItemSchema);
