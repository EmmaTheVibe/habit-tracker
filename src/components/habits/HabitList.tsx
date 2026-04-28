"use client";

import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";
import EmptyState from "./EmptyState";

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
    return <EmptyState />;
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
      <ul className="space-y-5" aria-label="Your habits">
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
