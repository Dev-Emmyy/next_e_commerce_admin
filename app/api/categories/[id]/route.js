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

    let { name, parentCategory, properties } = await request.json();
    console.log('Received request body:', { name, parentCategory, properties });

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
            parentCategory: parentCategoryId,
            properties: properties || [] // Add the properties field
        };

        console.log('Updating with data:', updateData);

        // Check if the update will actually change anything
        if (existingCategory.name === updateData.name && 
            existingCategory.parentCategory?.toString() === updateData.parentCategory?.toString() &&
            JSON.stringify(existingCategory.properties) === JSON.stringify(updateData.properties)) {
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


export async function DELETE(request, { params }) {
  const { id } = params;
  console.log('Received category ID for deletion:', id);

  if (!ObjectId.isValid(id)) {
    console.error('Invalid category ID:', id);
    return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test');
    const categoriesCollection = db.collection('categories');

    // Check if the category exists
    const categoryToDelete = await categoriesCollection.findOne({ _id: new ObjectId(id) });
    if (!categoryToDelete) {
      console.error('Category not found in database:', id);
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Check if this category is a parent to any other categories
    const childCategories = await categoriesCollection.find({ parentCategory: new ObjectId(id) }).toArray();
    if (childCategories.length > 0) {
      console.error('Cannot delete category with child categories:', id);
      return NextResponse.json({ message: 'Cannot delete category with child categories' }, { status: 400 });
    }

    // Perform the deletion
    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.error('Failed to delete category:', id);
      return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
    }

    console.log('Successfully deleted category:', id);
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}