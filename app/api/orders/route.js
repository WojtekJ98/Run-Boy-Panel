import { NextResponse } from "next/server";
import { Order } from "../../../models/Order";
import mongooseConnect from "../../lib/mongoose";

export async function GET(req) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");
    const limit = parseInt(searchParams.get("limit")) || 0;
    const query = userId ? { user: userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching data",
      details: error.message,
    });
  }
}
