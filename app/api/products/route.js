// app/api/products/route.js
import { NextResponse } from 'next/server';
import client from '@/app/lib/db';
import { Product } from '@/models/Product';



export async function POST(request) {
  try {
    await client.connect();
    const db = client.db();

    const formData = await request.json();

   
    const newProduct = new Product(formData);

    await db.collection('products').insertOne(newProduct);

    return NextResponse.json({ message: 'Product created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  } finally {
    await client.close();
  };
};



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const initializedClient = await client; // Await the resolved client Promise
    const db = initializedClient.db('test');
    let product;

    if (id) {
      product = await db.collection('products').findOne({ _id: new ObjectId(id) });
      if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
      }
    } else {
      const products = await db.collection('products').find({}).toArray();
      product = products;
    }

    return new Response(JSON.stringify({ product }), { status: 200 });
  } catch (error) {
    console.error("Error fetching product(s):", error);
    return new Response(JSON.stringify({ error: "Failed to fetch product(s): " + error.message }), { status: 500 });
  }
}
