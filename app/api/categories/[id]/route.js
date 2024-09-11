import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
    const { id } = params;
    console.log('Received category ID:', id);

    if (!ObjectId.isValid(id)) {
        console.error('Invalid category ID:', id);
        return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    let { name, parentCategory } = await request.json();
    console.log('Received request body:', { name, parentCategory });

    try {
        const client = await clientPromise;
        const db = client.db('test'); // Make sure this matches your database name
        const categoriesCollection = db.collection('categories');

        const existingCategory = await categoriesCollection.findOne({ _id: new ObjectId(id) });
        if (!existingCategory) {
            console.error('Category not found in database:', id);
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        console.log('Existing category:', existingCategory);

        let parentCategoryId = null;
        if (parentCategory) {
            if (!ObjectId.isValid(parentCategory)) {
                console.error('Invalid parent category ID:', parentCategory);
                return NextResponse.json({ message: 'Invalid parent category ID' }, { status: 400 });
            }
            parentCategoryId = new ObjectId(parentCategory);
            const parentCategoryDoc = await categoriesCollection.findOne({ _id: parentCategoryId });
            if (!parentCategoryDoc) {
                console.error('Parent category not found:', parentCategory);
                return NextResponse.json({ message: 'Parent category not found' }, { status: 400 });
            }
        }

        const updateData = { 
            name: name,
            parentCategory: parentCategoryId
        };

        console.log('Updating with data:', updateData);

        // Check if the update will actually change anything
        if (existingCategory.name === updateData.name && 
            existingCategory.parentCategory?.toString() === updateData.parentCategory?.toString()) {
            console.log('No changes detected. Skipping update.');
            return NextResponse.json({ message: 'No changes needed', data: existingCategory }, { status: 200 });
        }

        const result = await categoriesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        console.log('Update result:', result);

        if (result.matchedCount === 0) {
            console.error('No document matched the query criteria.');
            return NextResponse.json({ message: 'No matching document found' }, { status: 404 });
        }

        if (result.modifiedCount === 0) {
            console.warn('Document was found, but no changes were made.');
            return NextResponse.json({ message: 'No changes made to the document' }, { status: 200 });
        }

        const updatedCategory = await categoriesCollection.findOne({ _id: new ObjectId(id) });
        console.log('Successfully updated category:', updatedCategory);

        return NextResponse.json({ success: true, data: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}