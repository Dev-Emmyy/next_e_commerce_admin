import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';
import { ObjectId } from 'mongodb';


export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('test');

    const { name, parentCategory, properties } = await request.json();
    
    const newCategory = { 
      name, 
      parentCategory: parentCategory || null,
      properties : properties || []
    };

    const result = await db.collection('categories').insertOne(newCategory);

    return NextResponse.json({ 
      message: 'Category created successfully', 
      category: { ...newCategory, _id: result.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('test'); // Make sure to use the correct database name

    let response;
    if (id) {
      try {
        const categories = await db.collection('categories').findOne({ _id: new ObjectId(id) });
        if (!categories) {
          return NextResponse.json({ error: 'categories not found' }, { status: 404 });
        }
        response = { categories };
      } catch (error) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
    } else {
      const categories = await db.collection('categories').find({}).toArray();
      response = { categories };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching categorie(s):", error);
    return NextResponse.json({ error: "Failed to fetch categorie(s): " + error.message }, { status: 500 });
  }
};