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

    if (userId) {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    } else {
      const users = await User.find({});
      return NextResponse.json(users);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error getting users", details: error.message },
      { status: 500 }
    );
  }
}
