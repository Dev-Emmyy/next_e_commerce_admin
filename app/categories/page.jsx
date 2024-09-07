'use client'
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategories, setParentCategories] = useState('');
    const [error, setError] = useState(null);
     useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories')
            .then(result => {
                // Extract the categories array from the response
                setCategories(result.data.categories);
                console.log('Fetched categories:', result.data.categories);
            })
            .catch(err => {
                console.error('Error fetching categories:', err);
                setError('Failed to fetch categories');
            });
    };

    async function saveCategory(event) {
        event.preventDefault();
        try {
            const response = await axios.post('/api/categories', { 
                name, 
                parentCategories: parentCategories || null 
            });
            console.log('Save category response:', response.data);
            setName('');
            setParentCategories('');
            fetchCategories(); // Refresh the categories list
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Failed to save category');
        }
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>New category name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input type="text" placeholder="Category name" className="mb-0"onChange={e => setName(e.target.value)}/>
                <select className="mb-0" value={parentCategories} onChange={e => setParentCategories(e.target.value)}>
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category. _id}>
                            <td>{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
};