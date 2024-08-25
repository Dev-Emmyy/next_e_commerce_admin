'use client';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function ProductForm({
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function createProducts(e){
        e.preventDefault();
        const data = {title, description, price};
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
        return null;
    }

    return (
          <form onSubmit={createProducts}>
            <h1>New Product</h1>
            <label>Product name</label>
            <input 
            type="text" 
            placeholder="product name" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            />
            <label>Description</label>
            <textarea 
            placeholder="description" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            />
            <label>Price (in USD)</label>
            <input 
            type="number" 
            value={price}
            placeholder="price" 
            onChange={e => setPrice(e.target.value)}
            />
            <button 
            type="submit" 
            className="btn-primary">
              Save
            </button>
          </form>
    );
};