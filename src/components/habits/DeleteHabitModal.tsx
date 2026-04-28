"use client";

import { createPortal } from "react-dom";

interface DeleteHabitModalProps {
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteHabitModal({
  habitName,
  onConfirm,
  onCancel,
}: DeleteHabitModalProps) {
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Habit</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-700">
            &quot;{habitName}&quot;
          </span>
          ? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            data-testid="confirm-delete-button"
            onClick={onConfirm}
            className="cursor-pointer flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            data-testid="cancel-delete-button"
            onClick={onCancel}
            className="cursor-pointer flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
