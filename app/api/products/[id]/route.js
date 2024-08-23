
import { ObjectId } from 'mongodb';
import client from '@/app/lib/db';

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