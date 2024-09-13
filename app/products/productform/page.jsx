'use client';
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ _id,initialData }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const[category, setCategory] = useState('');
    const [price, setPrice] = useState(initialData?.price || '');
    const [images, setImages] = useState(initialData?.images || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [IsUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    useEffect(() => (
      axios.get('/api/categories/').then(result => {
        setCategories(result.data.categories);
      })
    ),[])
    async function saveProducts(e){
        e.preventDefault();
        const data = {title, description, price,images};
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
    };

    async function upLoadImages(ev) {
    const files = ev.target?.files;
    setIsUploading(true);
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      try {
        const res = await axios.post('/api/upload', data);
        if (res.data.success) {
          setImages(prev => [...prev, ...res.data.files.map(file => file.path)]);
        } else {
          console.error('Upload failed:', res.data.error);
        }
      } catch (error) {
        console.error('Upload error:', error.response?.data?.error || error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  function updateImagesOrder(images) {
    setImages(images);
  };

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
            <select value={category} 
            onChange={e => setCategory(e.target.value)}>
              <option value="">Uncategorized</option>
              {categories.length > 0 && categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <label>
              Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap">
                {images.map((imagePath, index) => (
                <div key={index} className="h-24">
                  <img src={imagePath} alt={`Image ${index}`} className="rounded-lg" />
                </div> 
              ))}
              </ReactSortable>
              {IsUploading && (
                <div className="h-24 flex items-center">
                  <Spinner/>
                </div>
              )}
              <label className="w-24 h-24 flex items-center justify-center text-sm gap-1 gray-500 rounded-lg bg-gray-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <div>
                  Upload
                </div>
                <input type="file" onChange={upLoadImages} className="hidden"/>
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