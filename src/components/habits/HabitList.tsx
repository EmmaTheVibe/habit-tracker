"use client";

import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  today: string;
  onUpdate: (updated: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({
  habits,
  today,
  onUpdate,
  onEdit,
  onDelete,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="text-5xl mb-4">🌱</div>
        <h2 className="text-lg font-semibold text-gray-700">No habits yet</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create your first habit to start building your streak.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes drop-in {
          0% { opacity: 0; transform: translateY(-16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .habit-drop-in {
          animation: drop-in 0.35s ease-out both;
        }
      `}</style>
      <ul className="space-y-3" aria-label="Your habits">
        {habits.map((habit, index) => (
          <li
            key={habit.id}
            className="habit-drop-in"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <HabitCard
              habit={habit}
              today={today}
              onUpdate={onUpdate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
