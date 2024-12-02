import { NextResponse } from "next/server";
import { Order } from "../../../models/Order";
import mongooseConnect from "../../lib/mongoose";

export async function GET(req) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    console.log(userId);

    if (userId) {
      const order = await Order.find({ user: userId });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    } else {
      const orders = await Order.find({});
      return NextResponse.json(orders);
    }
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching data",
      details: error.message,
    });
  }
}
