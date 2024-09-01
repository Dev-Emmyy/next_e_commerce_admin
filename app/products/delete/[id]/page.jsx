'use client';
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function DeleteProductPage({ params }) {
    const { id } = params;
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();

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

    function goBack() {
        router.push('/products');
    }

    function handleDelete() {
        axios.delete(`/api/products/${id}`)
            .then(() => {
                router.push('/products'); // Redirect after successful deletion
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    }

    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete {productInfo ? `"${productInfo.title}"` : 'this product'}?</h1>
            <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={handleDelete}>
                Yes
            </button>
            <button className="btn-default" onClick={goBack}>
                No
            </button>
            </div>
            
        </Layout>
    );
}




