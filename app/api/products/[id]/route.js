import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import clientPromise from '@/app/lib/db';
import { NextResponse } from 'next/server';

// GET: Fetch a product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params; // Extract ID from route parameters

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing Product ID" }, { status: 400 });
    }

    const client = await clientPromise; // Await the resolved client Promise
    const db = client.db('test');

    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product: " + error.message }, { status: 500 });
  }
}

// PUT: Update a product by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing Product ID' }, { status: 400 });
    }

    const formData = await request.json();
    const updateData = { ...formData }; // Spread the formData to create the update object

    const client = await clientPromise;
    const db = client.db('test');

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product: ' + error.message }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing Product ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('test');

    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product: ' + error.message }, { status: 500 });
  }
}