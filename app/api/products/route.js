// app/api/products/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();
        // Logic to handle the creation of the product (e.g., save to database)
        return NextResponse.json({ message: 'Product created successfully', data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
