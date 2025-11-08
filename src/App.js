import React, { useState } from "react";
import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import QRScanner from "./components/QRScanner";
import SupplyChainABI from "./SupplyChainABI.json";

const CONTRACT_ADDRESS = "0x85EBF59393A48e5cBec97e9C289d2E3A15A0Ea1F"; // your deployed contract

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);

  // ✅ Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          SupplyChainABI,
          signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // ✅ Add Product
  const addProduct = async () => {
    if (!contract || !productID || !productName || !location) {
      alert("Please fill all fields!");
      return;
    }
    try {
      const tx = await contract.addProduct(productID, productName, location);
      await tx.wait();
      setMessage("✅ Product added successfully!");
      setQrValue(productID);
      setProductID("");
      setProductName("");
      setLocation("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding product!");
    }
  };

  // ✅ Fetch Product
  const fetchProduct = async (id) => {
    try {
      const data = await contract.getProduct(id);
      const fetched = {
        id: id,
        name: data[0],
        location: data[1],
        timestamp: new Date(Number(data[2]) * 1000).toLocaleString(),
      };
      setScannedProduct(fetched);
      setMessage("✅ Product details loaded!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Product not found!");
    }
  };

  const handleScan = (data) => {
    if (data) {
      fetchProduct(data);
      setShowScanner(false);
    }
  };

  // 💾 Download QR Code
  const downloadQRCode = () => {
    const svg = document.querySelector("#product-qr svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${qrValue}_QRCode.png`;
      link.href = pngFile;
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // 📋 Copy QR Code to Clipboard
  const copyQRCode = async () => {
    const svg = document.querySelector("#product-qr svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const item = new ClipboardItem({ "image/svg+xml": blob });
    await navigator.clipboard.write([item]);
    alert("✅ QR Code copied to clipboard!");
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* 🌈 Rainbow Title */}
      <h1
        style={{
          fontWeight: "bold",
          background: "linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff1493)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.2em",
        }}
      >
        🔗 Blockchain Supply Chain Tracker
      </h1>

      {!account ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2b6cb0",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <p>
          <span style={{ color: "green", fontSize: "20px" }}>✅ CONNECTED</span>
        </p>
      )}

      {/* Add Product */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Product ID"
          value={productID}
          onChange={(e) => setProductID(e.target.value)}
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ margin: "5px", padding: "8px" }}
        />
        <button
          onClick={addProduct}
          style={{
            padding: "8px 15px",
            backgroundColor: "#38a169",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add Product
        </button>
      </div>

      {/* QR Code */}
      {qrValue && (
        <div id="product-qr" style={{ marginTop: "30px" }}>
          <h3>Product QR Code:</h3>
          <QRCodeSVG value={qrValue} size={180} />
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={downloadQRCode}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                backgroundColor: "#4299e1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              💾 Download
            </button>
            <button
              onClick={copyQRCode}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ed64a6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}

      {/* Scanner */}
      <div style={{ marginTop: "30px" }}>
        {!showScanner ? (
          <button
            onClick={() => setShowScanner(true)}
            style={{
              padding: "8px 15px",
              backgroundColor: "#805ad5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Open Scanner
          </button>
        ) : (
          <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
        )}
      </div>

      {/* Scanned Product */}
      {scannedProduct && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "300px",
            marginInline: "auto",
          }}
        >
          <h3>📦 Product Details</h3>
          <p><b>ID:</b> {scannedProduct.id}</p>
          <p><b>Name:</b> {scannedProduct.name}</p>
          <p><b>Location:</b> {scannedProduct.location}</p>
          <p><b>Added on:</b> {scannedProduct.timestamp}</p>
        </div>
      )}

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

export default App;
