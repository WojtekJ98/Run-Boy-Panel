"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Upload from "../assets/icons/upload.svg";
import LoadingSpiner from "../components/LoadingSpiner";
import { ReactSortable } from "react-sortablejs";
import Select from "react-select";

const customStylesSelect = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? " rgb(22 163 74)" : "rgb(20 83 45)",
    boxShadow: state.isFocused ? "0 0 0 1px  rgb(22 163 74)" : "none",

    "&:hover": {
      borderColor: "none",
    },
  }),
};

export default function ProductForm({
  _id,
  name: currentName,
  description: currentDescription,
  price: currentPrice,
  images: currentImages,
  category: currentCategory,
  properties: assignedProperties,
}) {
  const [name, setName] = useState(currentName || "");
  const [description, setDescription] = useState(currentDescription || "");
  const [price, setPrice] = useState(currentPrice || "");
  const [showProducts, setShowProducts] = useState(false);
  // categories
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(currentCategory || "");
  // tutaj img
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(currentImages || []);
  // Properties
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  // Loading
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // category
  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (showProducts) {
      router.push("/products");
    }
  }, [showProducts]);

  // Here save or add product
  async function addNewProduct(e) {
    console.log("Form data before submission:", productProperties);

    e.preventDefault();
    const data = {
      name,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    console.log("Submitting data:", data);

    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setShowProducts(true);
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    uploadImage(selectedFile);
  };

  const uploadImage = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const fileType = file.type;

      // Send required fields for new product or just update images for existing product
      const res = await axios.post("/api/upload", {
        fileType,
      });

      const { signedUrl, imageUrl } = res.data;

      // Upload the file directly to S3
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": fileType,
        },
      });

      // Add the new image URL to the existing images
      setImages((prevImages) => [...prevImages, imageUrl]);

      alert("Upload successful!");
    } catch (error) {
      console.error("Error with uploading file", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  function updateImagesOrder(images) {
    setImages(images);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let categoryInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...categoryInfo.properties);
    while (categoryInfo.parent?._id) {
      const parentCategory = categories.find(
        ({ _id }) => _id === categoryInfo?.parent?._id
      );
      propertiesToFill.push(...parentCategory.properties);
      categoryInfo = parentCategory;
    }
  }
  function setProductProperty(propertyName, value) {
    console.log(`Setting property ${propertyName} to value:`, value);

    setProductProperties((prev) => {
      const newProductProperty = { ...prev };
      newProductProperty[propertyName] = value;
      console.log("Updated productProperties:", newProductProperty);

      return newProductProperty;
    });
  }
  useEffect(() => {
    console.log("Product properties state updated:", productProperties);
  }, [productProperties]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <LoadingSpiner />
        </div>
      ) : (
        <form onSubmit={addNewProduct}>
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category.name} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          {propertiesToFill.length > 0 &&
            propertiesToFill.map((prop) => (
              <div key={prop.name} className="">
                <label className="">
                  {prop.name[0].toUpperCase() + prop.name.substring(1)}
                </label>

                {prop.name === "size" ? (
                  <Select
                    className="customStylesSelect"
                    styles={customStylesSelect}
                    closeMenuOnSelect={false}
                    classNamePrefix="select"
                    isMulti
                    name="sizes"
                    value={
                      productProperties[prop.name]?.map((value) => ({
                        value,
                        label: value,
                      })) || []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [];
                      setProductProperty(prop.name, selectedValues);
                    }}
                    options={prop.values.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                ) : (
                  <select
                    className=""
                    value={productProperties[prop.name]}
                    onChange={(e) => {
                      console.log(
                        `Changing property ${prop.name} to value:`,
                        e.target.value
                      );
                      setProductProperty(prop.name, e.target.value);
                    }}>
                    <option value="">-</option>
                    {prop.values.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          <label>Images</label>
          <div className="flex flex-col gap-2">
            {!images?.length && <div>No images in this product.</div>}
            {images?.length > 0 && (
              <div>
                <ReactSortable
                  className="my-1 grid  grid-cols-[repeat(auto-fill,_minmax(96px,_1fr))] justify-items-center gap-2"
                  list={images}
                  setList={updateImagesOrder}>
                  {images.map((url, index) => (
                    <div className="h-24" key={index}>
                      <img
                        src={url}
                        alt=""
                        className="rounded-lg h-full object-cover"
                      />
                    </div>
                  ))}
                </ReactSortable>
              </div>
            )}

            {uploading && (
              <div className="h-24 w-24 flex justify-center items-center bg-gray-300 px-2  rounded-lg mx-2">
                <LoadingSpiner />
              </div>
            )}
            <label className="uploadBtn cursor-pointer my-1 shadow-sm">
              <Upload /> <div>Add image</div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <label>Product Description</label>
          <textarea
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Product Price $</label>
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Save
          </button>
        </form>
      )}
    </>
  );
}
