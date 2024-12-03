import { NextResponse } from "next/server";
import { User } from "../../../models/User";
import mongooseConnect from "../../lib/mongoose";

export async function POST(req) {
  try {
    await mongooseConnect();
    const body = await req.json();
    console.log("Received data in Post route: ", body);

    const { name, email, password, createdAt } = body;

    const UserDoc = await User.create({
      name,
      email,
      password,
      createdAt,
    });
    return NextResponse.json({
      message: "User added",
      user: UserDoc,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding user", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit")) || 0;
    const query = userId ? { _id: userId } : {};
    const users = await User.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Error getting users", details: error.message },
      { status: 500 }
    );
  }
}
