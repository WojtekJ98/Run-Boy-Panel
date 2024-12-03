import { NextResponse } from "next/server";
import mongooseConnect from "../../lib/mongoose";
import { FavoriteItem } from "../../../models/FavoriteItem";

export async function GET(req) {
  try {
    await mongooseConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    if (userId) {
      const favoriteItem = await FavoriteItem.find({ user: userId });
      if (!favoriteItem) {
        return NextResponse.json(
          { error: "favoriteItem not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(favoriteItem);
    } else {
      const favoriteItems = await FavoriteItem.find({});
      return NextResponse.json(favoriteItems);
    }
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching data",
      details: error.message,
    });
  }
}
