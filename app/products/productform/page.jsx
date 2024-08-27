'use client';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function ProductForm({ _id,initialData }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    console.log({_id});

    async function saveProducts(e){
        e.preventDefault();
        const data = {title, description, price};
        if (_id) {
          await axios.put('/api/products', { ...data, id: _id });
        } else {
          await axios.post('/api/products', data);
        }
          setGoToProducts(true);
        };
        
    if (goToProducts) {
        router.push('/products');
        return null;
    }

    return (
          <form onSubmit={saveProducts}>
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