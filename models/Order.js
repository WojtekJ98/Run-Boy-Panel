const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    lineItems: Object,
    inputs: Object,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Order = models?.Order || model("Order", OrderSchema);
