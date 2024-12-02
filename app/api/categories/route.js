import mongoose from "mongoose";
import { Category } from "../../../models/Categories";
import mongooseConnect from "../../lib/mongoose";
import { NextResponse } from "next/server";
import { isAdminReq } from "../auth/[...nextauth]/route";
export async function POST(req) {
  try {
    await mongooseConnect();

    const body = await req.json();
    const { name, parentCategory, properties } = body;
    const parent = mongoose.Types.ObjectId.isValid(parentCategory)
      ? parentCategory
      : null;

    const CategoryDoc = await Category.create({
      name,
      parent,
      properties,
    });

    return NextResponse.json({
      message: "Category created",
      category: CategoryDoc,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating category", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await mongooseConnect();

    const category = await Category.find({}).populate("parent");
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Error no category", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await mongooseConnect();

    const body = await req.json();
    const { name, parentCategory, _id, properties } = body;
    const parent = mongoose.Types.ObjectId.isValid(parentCategory)
      ? parentCategory
      : null;

    await Category.updateOne({ _id }, { name, parent, properties });

    return NextResponse.json({
      message: "category update",
      category: Category,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error update category", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("id");
    if (!_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    await Category.deleteOne({ _id });
    return NextResponse.json({ message: "Category delete successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting product", details: error.message },
      { status: 500 }
    );
  }
}