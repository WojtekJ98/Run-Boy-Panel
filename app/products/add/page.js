import Layout from "../../../components/Layout";
import ProductForm from "../../../components/ProductForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
  return (
    <Layout>
      <ToastContainer />
      <h1>Details of New Product</h1>
      <ProductForm />
    </Layout>
  );
}
