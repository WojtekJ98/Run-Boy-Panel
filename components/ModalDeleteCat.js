"use client";
import { useEffect, useState } from "react";

export default function ModalDeleteCat({
  isOpen,
  onClose,
  categoryId,
  handleDelete,
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timeout;
    if (isOpen) {
      setShowModal(true);
    } else {
      timeout = setTimeout(() => setShowModal(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-[500ms] ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOverlayClick}>
      <div
        className={`bg-white p-4 rounded-lg max-w-lg border-2 transform transition-transform duration-[500ms] ${
          isOpen ? "scale-100" : "scale-95"
        }`}>
        <h3 className="text-center text-lg mb-4 font-semibold">
          Are you sure that you want to remove this category?
        </h3>
        <p className="text-center">
          You will remove:
          <span className="text-green-900 text-lg font-bold">
            {categoryId?.name}
          </span>
        </p>
        <div className="flex justify-center items-center gap-2 py-2">
          <button className="noLink" onClick={onClose}>
            No
          </button>
          <button className="deleteLink" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
