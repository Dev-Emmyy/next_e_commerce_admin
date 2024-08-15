import Layout from "@/components/Layout";

export default function NewProducts() {
    return (
        <Layout>
            <input className="focus:outline-none" type="text" placeholder="product name" />
        </Layout>
    );
}