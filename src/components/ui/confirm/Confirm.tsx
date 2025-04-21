import React from "react";

interface ConfirmProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Confirm: React.FC<ConfirmProps> = ({ title = "Confirm", message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
