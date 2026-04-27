import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import HabitList from "@/components/habits/HabitList";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";

const today = "2024-06-15";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Stay hydrated",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: [],
};

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Habit name is required",
      );
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    const habits: Habit[] = [];
    const onSave = vi.fn((data) => {
      habits.push({
        id: "new-habit",
        userId: "user-1",
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      });
    });
    const onCancel = vi.fn();

    render(<HabitForm onSave={onSave} onCancel={onCancel} />);

    await user.type(screen.getByTestId("habit-name-input"), "Read Books");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Read every morning",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Read Books", frequency: "daily" }),
      );
    });

    const slug = getHabitSlug("Read Books");
    const { rerender } = render(
      <HabitList
        habits={habits}
        today={today}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId(`habit-card-${slug}`)).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    let savedData: ReturnType<typeof vi.fn> | null = null;

    const onSave = vi.fn((data) => {
      savedData = data;
    });

    render(
      <HabitForm initial={baseHabit} onSave={onSave} onCancel={vi.fn()} />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");

    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Drink More Water",
          frequency: "daily",
        }),
      );
    });

    const callArg = onSave.mock.calls[0][0];
    expect(callArg.frequency).toBe("daily");
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const slug = getHabitSlug(baseHabit.name);

    render(
      <HabitCard
        habit={baseHabit}
        today={today}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByTestId(`habit-delete-${slug}`));
    expect(onDelete).not.toHaveBeenCalled();

    const confirmBtn = screen.getByTestId("confirm-delete-button");
    expect(confirmBtn).toBeInTheDocument();
    await user.click(confirmBtn);

    expect(onDelete).toHaveBeenCalledWith(baseHabit.id);
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    const slug = getHabitSlug(baseHabit.name);

    let currentHabit = { ...baseHabit };
    const onUpdate = vi.fn((updated: Habit) => {
      currentHabit = updated;
    });

    const { rerender } = render(
      <HabitCard
        habit={currentHabit}
        today={today}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId(`habit-streak-${slug}`)).toHaveTextContent("0");

    await user.click(screen.getByTestId(`habit-complete-${slug}`));
    expect(onUpdate).toHaveBeenCalled();

    rerender(
      <HabitCard
        habit={currentHabit}
        today={today}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId(`habit-streak-${slug}`)).toHaveTextContent("1");
  });
});
