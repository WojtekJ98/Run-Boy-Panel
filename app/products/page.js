"use client";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Edit from "../../assets/icons/edit.svg";
import Delete from "../../assets/icons/delete.svg";
import ModalDelete from "../../components/ModalDelete";
import { useRouter } from "next/navigation";
import LoadingSpiner from "../../components/LoadingSpiner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  // Loading
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const openDeleteModal = (product) => {
    setSelectedProductId(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  async function handleDelete(e) {
    e.preventDefault();
    try {
      await axios.delete(`/api/products?id=${selectedProductId._id}`);
      toast.success("Product delete successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== selectedProductId._id)
      );
      closeModal();
    } catch (error) {
      console.error("Error with deleting", error);
      const errorMessage =
        error.response?.data?.error || "Error with deleting.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <>
      <Layout>
        <ToastContainer />
        <Link
          className="bg-green-900 py-1 px-2 rounded-lg text-white"
          href={"/products/add"}>
          Add new product
        </Link>
        {loading ? (
          <div className="loading">
            <LoadingSpiner />
          </div>
        ) : (
          <div>
            <div className="flex mt-4 items-center justify-between border-b-2 pb-2 ">
              <span className="text-green-900 text-sm font-semibold ">
                Product Name
              </span>
              <span className="text-green-900 text-sm font-semibold mr-10">
                Actions
              </span>
            </div>
            {products.map((product) => (
              <div
                key={product._id}
                className="flex py-1 items-center justify-between border-b-2">
                <h3>{product.name}</h3>
                <div className="flex  items-center justify-center gap-2">
                  <Link
                    className="editLink"
                    href={"products/edit/" + product._id}>
                    <Edit /> Edit
                  </Link>
                  <button
                    className="deleteLink"
                    onClick={() => openDeleteModal(product)}>
                    <Delete /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
      {isModalOpen && (
        <ModalDelete
          isOpen={isModalOpen}
          onClose={closeModal}
          productId={selectedProductId}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}
