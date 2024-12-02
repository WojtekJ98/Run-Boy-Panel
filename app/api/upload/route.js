import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import mongooseConnect from "../../lib/mongoose";

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

export async function POST(req) {
  try {
    await mongooseConnect();

    const { fileType } = await req.json();
    const fileName = `${uuidv4()}.${fileType.split("/")[1]}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      ContentType: fileType,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    return NextResponse.json({ signedUrl, imageUrl });
  } catch (error) {
    console.error("Error generating URL", error);
    return NextResponse.json(
      { error: "Failed to generate URL" },
      { status: 500 }
    );
  }
}
