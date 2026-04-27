"use client";

import { useState } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";

interface HabitCardProps {
  habit: Habit;
  today: string;
  onUpdate: (updated: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({
  habit,
  today,
  onUpdate,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  return (
    <>
      <article
        data-testid={`habit-card-${slug}`}
        className={`rounded-xl border p-4 transition-all ${
          isCompleted
            ? "bg-green-50 border-green-200"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base truncate ${isCompleted ? "text-green-800 line-through" : "text-gray-900"}`}
            >
              {habit.name}
            </h3>
            {habit.description && (
              <p className="mt-0.5 text-sm text-gray-500 truncate">
                {habit.description}
              </p>
            )}
            <div
              data-testid={`habit-streak-${slug}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-600"
            >
              🔥 {streak} day{streak !== 1 ? "s" : ""}
            </div>
          </div>

          <button
            data-testid={`habit-complete-${slug}`}
            onClick={() => onUpdate(toggleHabitCompletion(habit, today))}
            aria-pressed={isCompleted}
            aria-label={
              isCompleted
                ? `Unmark ${habit.name} as complete`
                : `Mark ${habit.name} as complete`
            }
            className={`cursor-pointer shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isCompleted
                ? "bg-green-500 border-green-500 text-white"
                : "bg-white border-gray-300 text-transparent hover:border-green-400"
            }`}
          >
            ✓
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="cursor-pointer flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setShowDeleteModal(true)}
            className="cursor-pointer flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </article>

      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteModal(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Delete Habit
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">
                &quot;{habit.name}&quot;
              </span>
              ? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                data-testid="confirm-delete-button"
                onClick={() => onDelete(habit.id)}
                className="cursor-pointer flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button
                data-testid="cancel-delete-button"
                onClick={() => setShowDeleteModal(false)}
                className="cursor-pointer flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
