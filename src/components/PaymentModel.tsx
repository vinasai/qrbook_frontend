import React from "react";
import { X } from "lucide-react";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
};

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-medium text-gray-900">Amount Due</p>
            <p className="text-3xl font-bold text-blue-600">
              ${amount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Please complete the Interac e-Transfer to the following email:
            </p>
            <p className="font-mono bg-gray-100 p-3 rounded text-center">
              payments@businesscard.com
            </p>
            <p className="text-sm text-gray-500">
              Once payment is confirmed, your QR code will be generated
              immediately.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              I've Sent Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
