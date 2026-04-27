"use client";

import { useState, FormEvent } from "react";
import { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";

interface HabitFormProps {
  initial?: Partial<Habit>;
  onSave: (data: {
    name: string;
    description: string;
    frequency: "daily";
  }) => void;
  onCancel: () => void;
}

export default function HabitForm({
  initial,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [frequency] = useState<"daily">("daily");
  const [nameError, setNameError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }
    setNameError(null);
    onSave({
      name: validation.value,
      description: description.trim(),
      frequency,
    });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      <div>
        <label
          htmlFor="habit-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Habit Name{" "}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(null);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Drink Water"
          aria-describedby={nameError ? "habit-name-error" : undefined}
          aria-invalid={!!nameError}
        />
        {nameError && (
          <p
            id="habit-name-error"
            role="alert"
            className="mt-1 text-xs text-red-600"
          >
            {nameError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="habit-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={2}
          placeholder="Why does this habit matter?"
        />
      </div>

      <div>
        <label
          htmlFor="habit-frequency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          disabled
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {initial?.id ? "Save Changes" : "Create Habit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
