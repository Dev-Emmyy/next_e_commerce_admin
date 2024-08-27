'use client'
import Layout from "@/components/Layout";
import axios from "axios";
import ProductForm from "../../productform/page";
import { useState, useEffect } from 'react';

export default function EditProductPage({ params }) {
  const { id } = params;
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/products/${id}`)
        .then(response => {
          setProductInfo(response.data.product);
          console.log(response.data.product);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [id]);

  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && (
        <ProductForm initialData={productInfo} _id={id} />
      )}
    </Layout>
  );
}



