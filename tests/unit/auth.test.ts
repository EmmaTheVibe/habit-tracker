import { describe, it, expect, beforeEach } from "vitest";
import { signUp, logIn, logOut } from "@/lib/auth";
import { getSession, getUsers } from "@/lib/storage";

beforeEach(() => localStorage.clear());

describe("auth", () => {
  it("signUp creates a new user and returns a session", () => {
    const result = signUp("alice@example.com", "password123");
    expect(result.success).toBe(true);
    expect(result.session?.email).toBe("alice@example.com");

    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("alice@example.com");
  });

  it("signUp fails when email is already registered", () => {
    signUp("alice@example.com", "password123");
    const result = signUp("alice@example.com", "otherpass");
    expect(result.success).toBe(false);
    expect(result.error).toBe("User already exists");
  });

  it("signUp persists the session to storage", () => {
    signUp("alice@example.com", "password123");
    const session = getSession();
    expect(session?.email).toBe("alice@example.com");
  });

  it("logIn returns a session for valid credentials", () => {
    signUp("bob@example.com", "secret");
    const result = logIn("bob@example.com", "secret");
    expect(result.success).toBe(true);
    expect(result.session?.email).toBe("bob@example.com");
  });

  it("logIn fails for invalid credentials", () => {
    const result = logIn("nobody@example.com", "wrong");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid email or password");
  });

  it("logOut clears the session", () => {
    signUp("alice@example.com", "password123");
    expect(getSession()).not.toBeNull();
    logOut();
    expect(getSession()).toBeNull();
  });
});
