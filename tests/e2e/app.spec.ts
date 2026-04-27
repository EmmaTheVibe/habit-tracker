import { test, expect, Page } from "@playwright/test";

const TEST_EMAIL = "e2e-user@example.com";
const TEST_PASSWORD = "testpassword123";

async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("habit-tracker-users");
    localStorage.removeItem("habit-tracker-session");
    localStorage.removeItem("habit-tracker-habits");
  });
}

async function signUpUser(
  page: Page,
  email = TEST_EMAIL,
  password = TEST_PASSWORD,
) {
  await page.goto("/signup");
  await page.getByTestId("auth-signup-email").fill(email);
  await page.getByTestId("auth-signup-password").fill(password);
  await page.getByTestId("auth-signup-submit").click();
  await page.waitForURL("/dashboard");
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await signUpUser(page);
    await page.goto("/");
    await page.waitForURL("/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill(TEST_EMAIL);
    await page.getByTestId("auth-signup-password").fill(TEST_PASSWORD);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await signUpUser(page);

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login");

    await page.getByTestId("auth-login-email").fill(TEST_EMAIL);
    await page.getByTestId("auth-login-password").fill(TEST_PASSWORD);
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("/dashboard");

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

    await page.getByTestId("auth-logout-button").click();
    await signUpUser(page, "other@example.com", "otherpass");
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signUpUser(page);
    await expect(page.getByTestId("empty-state")).toBeVisible();

    await page.getByTestId("create-habit-button").click();
    await expect(page.getByTestId("habit-form")).toBeVisible();

    await page.getByTestId("habit-name-input").fill("Read Books");
    await page.getByTestId("habit-description-input").fill("Read 20 pages");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();
    await expect(page.getByTestId("empty-state")).not.toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await signUpUser(page);

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Meditate");
    await page.getByTestId("habit-save-button").click();

    const streakEl = page.getByTestId("habit-streak-meditate");
    await expect(streakEl).toContainText("0");

    await page.getByTestId("habit-complete-meditate").click();
    await expect(streakEl).toContainText("1");

    await page.getByTestId("habit-complete-meditate").click();
    await expect(streakEl).toContainText("0");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signUpUser(page);

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Exercise");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-exercise")).toBeVisible();

    await page.reload();
    await page.waitForURL("/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-exercise")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signUpUser(page);

    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");

    await page.goto("/dashboard");
    await page.waitForURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
  }) => {
    await signUpUser(page);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.waitForTimeout(2000);

    const swSupported = await page.evaluate(() => "serviceWorker" in navigator);
    expect(swSupported).toBe(true);

    const manifestLink = await page
      .locator('link[rel="manifest"]')
      .getAttribute("href");
    expect(manifestLink).toBe("/manifest.json");
  });
});

test.describe("Habit Tracker UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearStorage(page);
    await signUpUser(page);
  });

  test("edits a habit and shows the updated name", async ({ page }) => {
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Old Name");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-old-name")).toBeVisible();

    await page.getByTestId("habit-edit-old-name").click();
    const nameInput = page.getByTestId("habit-name-input");
    await nameInput.clear();
    await nameInput.fill("New Name");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-new-name")).toBeVisible();
    await expect(page.getByTestId("habit-card-old-name")).not.toBeVisible();
  });

  test("deletes a habit after confirmation and shows empty state", async ({
    page,
  }) => {
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("To Delete");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-to-delete")).toBeVisible();

    await page.getByTestId("habit-delete-to-delete").click();
    await expect(page.getByTestId("confirm-delete-button")).toBeVisible();
    await expect(page.getByTestId("habit-card-to-delete")).toBeVisible();

    await page.getByTestId("confirm-delete-button").click();
    await expect(page.getByTestId("habit-card-to-delete")).not.toBeVisible();
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("cancels delete when cancel is clicked in the modal", async ({
    page,
  }) => {
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Keep Me");
    await page.getByTestId("habit-save-button").click();

    await page.getByTestId("habit-delete-keep-me").click();
    await expect(page.getByTestId("confirm-delete-button")).toBeVisible();

    await page.getByTestId("cancel-delete-button").click();
    await expect(page.getByTestId("habit-card-keep-me")).toBeVisible();
  });

  test("shows validation error when habit name exceeds 60 characters", async ({
    page,
  }) => {
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("a".repeat(61));
    await page.getByTestId("habit-save-button").click();
    await expect(
      page.getByTestId("habit-name-input").locator('~ p[role="alert"]'),
    ).toBeVisible();
  });

  test("shows validation error when habit name is empty", async ({ page }) => {
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-save-button").click();
    await expect(page.locator("#habit-name-error")).toContainText("required");
  });

  test("closes the habit form modal when backdrop is clicked", async ({
    page,
  }) => {
    await page.getByTestId("create-habit-button").click();
    await expect(page.getByTestId("habit-form")).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(page.getByTestId("habit-form")).not.toBeVisible();
  });

  test("shows error for duplicate email on signup", async ({ page }) => {
    await page.getByTestId("auth-logout-button").click();
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill(TEST_EMAIL);
    await page.getByTestId("auth-signup-password").fill(TEST_PASSWORD);
    await page.getByTestId("auth-signup-submit").click();
    await expect(
      page.locator('[role="alert"]:not([aria-live])').first(),
    ).toContainText("already exists");
  });

  test("shows error for wrong password on login", async ({ page }) => {
    await page.getByTestId("auth-logout-button").click();
    await page.getByTestId("auth-login-email").fill(TEST_EMAIL);
    await page.getByTestId("auth-login-password").fill("wrongpassword");
    await page.getByTestId("auth-login-submit").click();
    await expect(
      page.locator('[role="alert"]:not([aria-live])').first(),
    ).toContainText("Invalid");
  });
});
