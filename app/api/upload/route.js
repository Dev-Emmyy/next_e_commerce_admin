import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');
    const productId = formData.get('productId');

    console.log('Received productId:', productId);

    if (!productId) {
      throw new Error('Product ID is missing');
    }

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueFilename = `${uuidv4()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, uniqueFilename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);

      uploadedFiles.push({
        originalName: file.name,
        filename: uniqueFilename,
        path: `/uploads/${uniqueFilename}`,
      });
    }

    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('test'); // Replace with your actual database name
    const collection = db.collection('products'); // Replace with your actual collection name

    const objectId = new ObjectId(productId);
    console.log('Searching for product with _id:', objectId);

    const result = await collection.updateOne(
      { _id: objectId },
      { $push: { images: { $each: uploadedFiles.map(file => file.path) } } }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }

    if (result.modifiedCount === 0) {
      throw new Error('Images not updated');
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}