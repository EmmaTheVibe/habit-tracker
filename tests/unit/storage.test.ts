import { describe, it, expect, beforeEach } from "vitest";
import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
  getHabits,
  saveHabits,
} from "@/lib/storage";

beforeEach(() => localStorage.clear());

describe("storage", () => {
  it("getUsers returns empty array when nothing is stored", () => {
    expect(getUsers()).toEqual([]);
  });

  it("saveUsers and getUsers round-trip correctly", () => {
    const users = [
      { id: "1", email: "a@a.com", password: "pass", createdAt: "2024-01-01" },
    ];
    saveUsers(users);
    expect(getUsers()).toEqual(users);
  });

  it("getSession returns null when nothing is stored", () => {
    expect(getSession()).toBeNull();
  });

  it("saveSession and getSession round-trip correctly", () => {
    const session = { userId: "1", email: "a@a.com" };
    saveSession(session);
    expect(getSession()).toEqual(session);
  });

  it("clearSession removes the session", () => {
    saveSession({ userId: "1", email: "a@a.com" });
    clearSession();
    expect(getSession()).toBeNull();
  });

  it("getHabits returns empty array when nothing is stored", () => {
    expect(getHabits()).toEqual([]);
  });

  it("saveHabits and getHabits round-trip correctly", () => {
    const habits = [
      {
        id: "1",
        userId: "u1",
        name: "Run",
        description: "",
        frequency: "daily" as const,
        createdAt: "2024-01-01",
        completions: [],
      },
    ];
    saveHabits(habits);
    expect(getHabits()).toEqual(habits);
  });
});
