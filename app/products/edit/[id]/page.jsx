'use client'
import Layout from "@/components/Layout";
import axios from "axios";
import { useState, useEffect } from 'react'

export default function EditProductPage({ params }) {
  const { id } = params;
  const [products, setProducts] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (id) {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(response => {
        setProducts(response.data.product);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching the product: ' + error.message);
        setLoading(false);
      });
  }
}, [id]);

if (loading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;

// Render product details or other content
return (
  <div>
    {products.map(product => (
    <h1 key={product._id}>{product.name}</h1>
    ))}
  </div>
);
}