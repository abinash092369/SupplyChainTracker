import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRScanner = ({ onScan, onClose }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>📷 Scan Product QR Code</h3>

      <div
        style={{
          width: "260px",
          height: "260px",
          margin: "auto",
          borderRadius: "12px",
          overflow: "hidden",
          border: "2px solid #805ad5",
        }}
      >
        <Scanner
          onScan={(result) => {
            if (result && result[0]?.rawValue) {
              onScan(result[0].rawValue);
            }
          }}
          onError={(error) => console.error(error)}
          styles={{
            container: { width: "100%", height: "100%" },
            video: { objectFit: "cover" },
            viewFinder: { border: "2px solid red" },
          }}
        />
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#e53e3e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Close Scanner
      </button>
    </div>
  );
};

export default QRScanner;