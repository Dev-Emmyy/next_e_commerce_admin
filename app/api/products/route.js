import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';
import { ObjectId } from 'mongodb';


// Create Product (POST)
export async function POST(request) {
  console.log('Starting POST request to create product');
  let client;
  try {
    console.log('Attempting to connect to MongoDB');
    client = await clientPromise;
    console.log('MongoDB connection successful');

    const db = client.db(); // Assuming your clientPromise connects to the right database
    console.log('Database selected');

    console.log('Parsing request body');
    const formData = await request.json();
    console.log('Received form data:', formData);

    console.log('Attempting to insert product');
    const productsCollection = db.collection('products'); // Use the appropriate collection name
    const result = await productsCollection.insertOne(formData);
    console.log('Product inserted successfully:', result);

    if (result.acknowledged && result.insertedId) {
      return NextResponse.json({ message: 'Product created successfully', id: result.insertedId }, { status: 201 });
    } else {
      throw new Error('Product insertion was not acknowledged by the database');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
};

// Update Product (PUT)
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const formData = await request.json();
    const { id, ...updateData } = formData;

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const result = await db.collection('products').updateOne(
      { _id: objectId }, 
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
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('test'); // Make sure to use the correct database name

    let response;
    if (id) {
      try {
        const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        response = { product };
      } catch (error) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
    } else {
      const products = await db.collection('products').find({}).toArray();
      response = { products };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching product(s):", error);
    return NextResponse.json({ error: "Failed to fetch product(s): " + error.message }, { status: 500 });
  }
}