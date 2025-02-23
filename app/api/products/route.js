import { NextResponse } from "next/server";
import { Product } from "../../../models/Product";
import mongooseConnect from "../../lib/mongoose";
import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
export async function POST(req, res) {
  try {
    await mongooseConnect();
    const session = await getServerSession(OPTIONS);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { name, description, price, images, category, properties } = body;

    const ProductDoc = await Product.create({
      name,
      description,
      price,
      images,
      category,
      properties,
      owner: session.user.email,
    });

    return NextResponse.json({
      message: "Product added",
      product: ProductDoc,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding product", details: error.message },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (productId) {
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    } else {
      const products = await Product.find({});
      return NextResponse.json(products);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding product", details: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await mongooseConnect();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, images, _id, category, properties } =
      body;
    await Product.updateOne(
      { _id },
      {
        name,
        description,
        price,
        images,
        category,
        properties,
      }
    );

    return NextResponse.json({
      message: "Product update",
      product: Product,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error update product", details: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await mongooseConnect();
    const session = await getServerSession(OPTIONS);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("id");
    if (!_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await Product.findOne({ _id });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (session.user.role !== "admin" && product.owner !== session.user.email) {
      console.log(session);

      return NextResponse.json(
        {
          error: "You can only delete products you have added.",
        },
        { status: 403 }
      );
    }

    await Product.deleteOne({ _id });
    return NextResponse.json({ message: "Product delete successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting product", details: error.message },
      { status: 500 }
    );
  }
}
