import Layout from "@/components/Layout";

export default function NewProducts() {
    return (
        <Layout>
            <h1>New Product</h1>
            <label>Product name</label>
            <input type="text" placeholder="product name" />
            <label>Description</label>
            <textarea placeholder="description"></textarea>
            <input type="text" placeholder="price" />
        </Layout>
    );
}