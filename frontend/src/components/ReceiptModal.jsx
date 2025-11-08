import React from "react";

export default function ReceiptModal({ isOpen, onClose, receipt }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">✅ Checkout Successful</h2>
        <p className="text-gray-700">Thank you for your purchase!</p>
        <p className="mt-3 text-gray-800 font-semibold">
          Total: ₹{receipt.total}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(receipt.timestamp).toLocaleString()}
        </p>
        <button
          onClick={onClose}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
