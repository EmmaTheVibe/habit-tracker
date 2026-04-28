"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/types/habit";
import { Session } from "@/types/auth";
import { getSession, getHabits, saveHabits } from "@/lib/storage";
import { logOut } from "@/lib/auth";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Image from "next/image";

type Modal = { type: "create" } | { type: "edit"; habit: Habit } | null;

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function readHabits(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export default function DashboardClient() {
  const session = getSession();

  return (
    <ProtectedRoute>
      {session && <Dashboard session={session} />}
    </ProtectedRoute>
  );
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
    <>
      <style>{`
        @keyframes bubble-in {
          0% { opacity: 0; transform: translateY(8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div data-testid="dashboard-page" className="min-h-dvh">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <Image
              src="/icons/icon-192.png"
              alt="Habit Tracker"
              width={40}
              height={40}
            />
            <div className="flex items-center gap-3">
              <button
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto p-6">
          <div className="mb-8">
            <div
              className="rounded-xl w-fit max-w-full mb-8 p-2 shadow-[0_4px_30px_rgba(99,91,255,0.1)]"
              style={{ animation: "bubble-in 0.4s ease-out both" }}
            >
              <p className="text-sm text-gray-400 truncate">
                Hey, {session.email} 👋
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-indigo-700">My Habits</h2>
                <p className="text-xs text-amber-600 mt-0.5">{today}</p>
              </div>
              <button
                data-testid="create-habit-button"
                onClick={() => setModal({ type: "create" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <span aria-hidden="true">+</span> New Habit
              </button>
            </div>
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
    </>
  );
}
