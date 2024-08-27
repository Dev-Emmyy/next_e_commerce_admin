import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import client from '@/app/lib/db';
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';




export async function GET(request, { params }) {
  try {
    const { id } = params; // Extract ID from route parameters

    if (!id) {
      return new Response(JSON.stringify({ error: "Product ID is required" }), { status: 400 });
    }

    const initializedClient = await client; // Await the resolved client Promise
    const db = initializedClient.db('test');

    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ product }), { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch product: " + error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const formData = await request.json();
    const { id, ...updateData } = formData;

    // Convert the id to ObjectId if it's a valid MongoDB ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const result = await db.collection('products').updateOne(
      { _id: objectId },  // Use the ObjectId
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}