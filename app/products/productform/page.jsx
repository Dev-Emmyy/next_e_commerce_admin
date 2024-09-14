'use client';
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ _id, initialData }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [images, setImages] = useState(initialData?.images || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data.categories);
        });

        // Cleanup function for ReactSortable
        return () => {
            if (window.Sortable) {
                window.Sortable.destroy();
            }
        };
    }, []);

    async function saveProducts(e) {
        e.preventDefault();
        const data = { title, description, price, images, category };
        if (_id) {
            await axios.put('/api/products', { ...data, id: _id });
        } else {
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
        return null;
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            try {
                const res = await axios.post('/api/upload', data);
                setImages(prev => [...prev, ...res.data.files.map(file => file.path)]);
            } catch (error) {
                console.error('Upload error:', error);
            } finally {
                setIsUploading(false);
            }
        }
    }

    function updateImagesOrder(newImages) {
        setImages(newImages.map(img => img.path || img));
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
            <label>Category</label>
            <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
            >
                <option value="">Uncategorized</option>
                {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable 
                    list={images.map((path, index) => ({id: index, path}))}
                    setList={updateImagesOrder}
                >
                    {images.map((path, index) => (
                        <div key={index} className="h-24">
                            <img src={path} alt={`Product ${index + 1}`} className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add image</div>
                    <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
            </div>
            <label>Description</label>
            <textarea 
                placeholder="description" 
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <label>Price (in USD)</label>
            <input 
                type="number" 
                placeholder="price" 
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <button type="submit" className="btn-primary">
                Save
            </button>
        </form>
    );
}