import { NextResponse } from "next/server";
import { CartItem } from "../../../models/CartItem";
import mongooseConnect from "../../lib/mongoose";

export async function GET(req) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");
    console.log(userId);

    if (userId) {
      const cartItem = await CartItem.find({ user: userId });
      if (!cartItem) {
        return NextResponse.json(
          { error: "CartItem not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(cartItem);
    } else {
      const cartItems = await CartItem.find({});
      return NextResponse.json(cartItems);
    }
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching data",
      details: error.message,
    });
  }
}
