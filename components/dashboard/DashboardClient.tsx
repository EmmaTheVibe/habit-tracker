"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";
import { getSession, getHabits, saveHabits } from "@/lib/storage";
import { logOut } from "@/lib/auth";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";

type Modal = { type: "create" } | { type: "edit"; habit: Habit } | null;

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function readSession(): Session | null {
  return getSession();
}

function readHabits(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export default function DashboardClient() {
  const router = useRouter();
  const session = readSession();

  if (!session) {
    router.replace("/login");
    return null;
  }

  return <Dashboard session={session} />;
}

function Dashboard({ session }: { session: Session }) {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>(() =>
    readHabits(session.userId),
  );
  const [modal, setModal] = useState<Modal>(null);
  const today = getTodayString();

  function persistHabits(updated: Habit[]) {
    const all = getHabits();
    const others = all.filter((h) => h.userId !== session.userId);
    saveHabits([...others, ...updated]);
    setHabits(updated);
  }

  function handleCreate(data: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    persistHabits([
      ...habits,
      {
        id: crypto.randomUUID(),
        userId: session.userId,
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      },
    ]);
    setModal(null);
  }

  function handleEdit(data: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (modal?.type !== "edit") return;
    persistHabits(
      habits.map((h) => (h.id === modal.habit.id ? { ...h, ...data } : h)),
    );
    setModal(null);
  }

  function handleUpdate(updated: Habit) {
    persistHabits(habits.map((h) => (h.id === updated.id ? updated : h)));
  }

  function handleDelete(id: string) {
    persistHabits(habits.filter((h) => h.id !== id));
  }

  function handleLogout() {
    logOut();
    router.push("/login");
  }

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-indigo-600">Habit Tracker</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block truncate max-w-40">
              {session.email}
            </span>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-red-600 focus:outline-none focus:underline"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Habits</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <button
            data-testid="create-habit-button"
            onClick={() => setModal({ type: "create" })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span aria-hidden="true">+</span> New Habit
          </button>
        </div>

        <HabitList
          habits={habits}
          today={today}
          onUpdate={handleUpdate}
          onEdit={(habit) => setModal({ type: "edit", habit })}
          onDelete={handleDelete}
        />
      </main>

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modal.type === "create" ? "Create habit" : "Edit habit"}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModal(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-xl mx-0 sm:mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {modal.type === "create" ? "Create New Habit" : "Edit Habit"}
            </h2>
            <HabitForm
              initial={modal.type === "edit" ? modal.habit : undefined}
              onSave={modal.type === "create" ? handleCreate : handleEdit}
              onCancel={() => setModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
