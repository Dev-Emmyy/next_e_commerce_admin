'use client'
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories')
            .then(result => {
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
            let response;

            if (editedCategory) {
                response = await axios.put(`/api/categories/${editedCategory._id}`, { 
                    name, 
                    parentCategory: parentCategory || null 
                });
                console.log('Category edited:', response.data);
            } else {
                response = await axios.post('/api/categories', { 
                    name, 
                    parentCategory: parentCategory || null 
                });
                console.log('Category saved:', response.data);
            }

            setName('');
            setParentCategory('');
            setEditedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Failed to save category');
        }
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parentCategory || '');
    }

    // Helper function to get category name by ID
    function getCategoryNameById(id) {
        const category = categories.find(cat => cat._id === id);
        return category ? category.name : 'Unknown';
    }

    // Helper function to check if a category can be a parent
    function canBeParent(categoryId, currentId) {
        if (!categoryId) return true;
        if (categoryId === currentId) return false;
        const category = categories.find(cat => cat._id === categoryId);
        if (!category) return true;
        return category.parentCategory !== currentId;
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    type="text" 
                    placeholder="Category name" 
                    className="mb-0"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <select 
                    className="mb-0" 
                    value={parentCategory} 
                    onChange={e => setParentCategory(e.target.value)}
                >
                    <option value="">No parent category</option>
                    {categories.map(category => (
                        canBeParent(category._id, editedCategory?._id) && (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        )
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.parentCategory ? getCategoryNameById(category.parentCategory) : 'None'}</td>
                            <td>
                                <button 
                                    onClick={() => editCategory(category)} 
                                    className="btn-primary mr-1"
                                >
                                    Edit
                                </button>
                                <button className="btn-primary">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}