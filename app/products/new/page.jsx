import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ProductForm from "../productform/page";
import axios from "axios";

export default function NewProduct() {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/api/products/${id}`)
        .then(response => {
        setProductInfo(response.data.product);
        })
    },[id]);

    return (
         <Layout>
          <ProductForm {...productInfo}/>
         </Layout>
    );
}