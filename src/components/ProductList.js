import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async (productId, nextStage) => {
    try {
      await axios.post("http://localhost:5000/api/transfer", {
        productId,
        nextStage,
      });
      alert(`Product moved to ${nextStage}`);
      fetchProducts();
    } catch (err) {
      alert("Error transferring product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">All Products</h2>

      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Stage</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border">
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.location}</td>
                <td className="border p-2">{p.stage}</td>
                <td className="border p-2">
                  {p.stage !== "Customer" && (
                    <button
                      onClick={() =>
                        handleTransfer(
                          p.id,
                          p.stage === "Manufacturer"
                            ? "Distributor"
                            : p.stage === "Distributor"
                            ? "Retailer"
                            : "Customer"
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Move Next
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
