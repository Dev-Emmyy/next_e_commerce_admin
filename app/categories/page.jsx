'use client'
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const result = await axios.get('/api/categories');
            setCategories(result.data.categories);
            console.log('Fetched categories:', result.data.categories);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories');
        }
    };

    async function saveCategory(event) {
        event.preventDefault();
        try {
            let response;

            if (editedCategory) {
                response = await axios.put(`/api/categories/${editedCategory._id}`, { 
                    name, 
                    parentCategory: parentCategory || null,
                    properties: properties
                });
                console.log('Category edited:', response.data);
            } else {
                response = await axios.post('/api/categories', { 
                    name, 
                    parentCategory: parentCategory || null,
                    properties: properties
                });
                console.log('Category saved:', response.data);
            }

            setName('');
            setParentCategory('');
            setProperties([]);
            setEditedCategory(null);
            await fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Failed to save category');
        }
    };

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parentCategory || '');
        setProperties(category.properties || []);
    };

    function getCategoryNameById(id) {
        const category = categories.find(cat => cat._id === id);
        return category ? category.name : 'Unknown';
    };

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton : true,
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            cancelButtonText: 'Cancel',
            reverseButtons : true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/categories/${category._id}`);
                    console.log('Category deleted');
                    await fetchCategories();
                } catch (error) {
                    console.error('Error deleting category:', error);
                    setError('Failed to delete category');
                }
            }
        });
    };

    function addProperty() {
        setProperties(prev => [...prev, {name: '', values: ''}]);
    };

    function handlePropertyNameChange(index, newName) {
        setProperties(prev => {
            const properties = [...prev];
            if (properties[index]) {
                properties[index].name = newName;
            }
            return properties;
        });
    };

    function handlePropertyValuesChange(index, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            if (properties[index]) {
                properties[index].values = newValues;
            }
            return properties;
        });
    };

    function removeProperty(indexToRemove) {
        setProperties(prev => prev.filter((_, pIndex) => pIndex !== indexToRemove));
    }

    return (
        <Layout>
            <h1>Categories</h1>
            {error && <p className="text-red-500">{error}</p>}
            <label>
                {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                        type="text" 
                        placeholder="Category name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <select 
                        value={parentCategory} 
                        onChange={e => setParentCategory(e.target.value)}
                    >
                        <option value="">No parent category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Properties section */}
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button 
                        onClick={addProperty}
                        type="button" 
                        className="btn-default text-sm mb-2">
                        Add new property
                    </button>
                    {properties.map((property, index) => (
                        <div className="flex gap-1 mb-2" key={index}>
                            <input
                                type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                                placeholder="property name (example: color)"
                            />
                            <input
                                type="text"
                                value={property.values}
                                className="mb-0"
                                onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                                placeholder="values, comma separated"
                            />
                            <button 
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn-default">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button 
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn-primary py-1">
                        Save
                    </button>
                </div>  
            </form>
            {editCategory && (
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
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className="btn-primary">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </Layout>
    );
};

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal}/>
));