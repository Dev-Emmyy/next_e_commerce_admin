'use client'
import Layout from "@/components/Layout";
import axios from "axios";
import { useState, useEffect } from 'react'

export default function EditProductPage({params}) {
    const { id } = params;
    const [product, setProduct] = useState([]);


    useEffect(() => {if (id) {
            // Fetch product data by ID
            axios.get(`/api/products/${id}`)
                .then(response => {
                    setProduct(response.data);
                })
                .catch(error => {
                    console.error('Error fetching the product:', error);
                });
        }
    }, [id]);
    return(
    <Layout>
      <h1>Edit Page</h1>
      <div>
        {product.map(product => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
            {/* Add more product details as needed */}
            <button>Edit</button>
          </div>
        ))}
      </div>
    </Layout>
    )
}