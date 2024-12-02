"use client";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import ModalDeleteCat from "../../components/ModalDeleteCat";
import Edit from "../../assets/icons/edit.svg";
import Delete from "../../assets/icons/delete.svg";
import LoadingSpiner from "../../components/LoadingSpiner";

export default function CategoriesPage() {
  const [editedCat, setEditedCat] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // property
  const [properties, setProperties] = useState([]);
  // Loading
  const [loading, setLoading] = useState(true);

  const openDeleteModal = (category) => {
    setSelectedCategoryId(category);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  async function handleDelete(e) {
    e.preventDefault();
    try {
      await axios.delete(`/api/categories?id=${selectedCategoryId._id}`);
      setCategories((prevCategories) =>
        prevCategories.filter(
          (category) => category._id !== selectedCategoryId._id
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error with deleting", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(","),
      })),
    };
    if (editedCat) {
      await axios.put("/api/categories", { ...data, _id: editedCat._id });
      setEditedCat(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCat(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }
  // adding property

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyName(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValue(index, property, newValue) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValue;
      return properties;
    });
  }
  function deleteProperty(index) {
    setProperties((prev) => {
      const newProperties = [...prev].filter((prop, propIndex) => {
        return propIndex !== index;
      });
      return newProperties;
    });
  }

  return (
    <>
      <Layout>
        {loading ? (
          <div className="loading">
            <LoadingSpiner />
          </div>
        ) : (
          <>
            <h1>Categories</h1>
            <label>
              {editedCat
                ? `Edit category ${editedCat.name}`
                : "Create new category"}
            </label>
            <form onSubmit={saveCategory}>
              <div className="flex mb-2 gap-1 items-center ">
                <input
                  type="text"
                  className="mb-0"
                  placeholder={`Category name`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <select
                  className="mb-0"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}>
                  <option value="0">No parent category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block ">Properties</label>
                <button
                  type="button"
                  onClick={addProperty}
                  className="noLink mb-2">
                  Add new property
                </button>
                {properties.length > 0 &&
                  properties.map((property, index) => (
                    <div className="flex gap-1" key={index}>
                      <input
                        value={property.name}
                        type="text"
                        placeholder="property name"
                        onChange={(e) =>
                          handlePropertyName(index, property, e.target.value)
                        }
                      />
                      <input
                        onChange={(e) =>
                          handlePropertyValue(index, property, e.target.value)
                        }
                        value={property.values}
                        type="text"
                        placeholder="values"
                      />
                      <button
                        className="noLink mb-2"
                        onClick={() => deleteProperty(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
              <div className="flex gap-1">
                {editedCat && (
                  <button
                    className="noLink"
                    type="button"
                    onClick={() => {
                      setEditedCat(null);
                      setName("");
                      setParentCategory("");
                      setProperties([]);
                    }}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
            {!editedCat && (
              <>
                <div className="flex mt-4 items-center justify-between border-b-2 ">
                  <span className="text-green-900 text-sm font-semibold  flex-1 text-center">
                    Category Name
                  </span>
                  <span className="text-green-900 text-sm font-semibold  flex-1 text-center">
                    Parent
                  </span>
                  <span className="text-green-900 text-sm font-semibold flex-1 text-center">
                    Actions
                  </span>
                </div>
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex py-1 items-center border-b-2">
                    <div className="flex-1 text-center">
                      <h3>{category.name}</h3>
                    </div>
                    <div className="flex-1 text-center">
                      <h3>{category?.parent?.name}</h3>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          className="editLink"
                          onClick={() => editCategory(category)}>
                          <Edit /> Edit
                        </button>
                        <button
                          className="deleteLink"
                          onClick={() => openDeleteModal(category)}>
                          <Delete /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Layout>
      {isModalOpen && (
        <ModalDeleteCat
          isOpen={isModalOpen}
          onClose={closeModal}
          categoryId={selectedCategoryId}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}
