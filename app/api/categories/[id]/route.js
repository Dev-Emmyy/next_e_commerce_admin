
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function PUT(request, { params }) {
    const { id } = params;
    const { name, parentCategory } = await request.json();

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const categoriesCollection = db.collection('categories');

        // Update the category
        const result = await categoriesCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    name: name,
                    parentCategory: parentCategory ? new ObjectId(parentCategory) : null
                } 
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        // Fetch the parent category if it exists
        let updatedCategory = result;
        if (updatedCategory.parentCategory) {
            const parentCategory = await categoriesCollection.findOne({ _id: updatedCategory.parentCategory });
            updatedCategory.parentCategory = parentCategory;
        }

        return NextResponse.json({ success: true, data: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    } finally {
        await client.close();
    }
}