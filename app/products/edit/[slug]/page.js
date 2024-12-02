"use client";
import { useParams } from "next/navigation";
import Layout from "../../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../../components/ProductForm";

export default function EditProductPage() {
  const [productDetails, setProductDetails] = useState(null);
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    if (!slug) {
      return;
    }
    axios.get(`/api/products?id=${slug}`).then((res) => {
      setProductDetails(res.data);
    });
  }, [slug]);

  return (
    <Layout>
      <h1 className="">Edit Product</h1>
      {productDetails && <ProductForm {...productDetails} />}
    </Layout>
  );
}
