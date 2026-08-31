import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage loads and primary CTAs navigate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /testing infrastructure built to ship/i })).toBeVisible();
  await page.getByRole("link", { name: "See our work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page.goto("/");
  await page.getByRole("link", { name: "Book a call" }).first().click();
  await expect(page).toHaveURL(/\/book$/);
});

test("desktop navigation reaches every main route", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Desktop navigation is replaced by the mobile menu.");
  const routes = [["Services", "/services"], ["Work", "/work"], ["Process", "/process"], ["About", "/about"]] as const;
  for (const [label, route] of routes) {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
  }
});

test("work list opens a generated case study", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByText("CASE STUDY / 01")).toBeVisible();
  await page.getByRole("link", { name: "Read case study" }).first().click();
  await expect(page).toHaveURL(/\/work\/saas-release-pipeline$/);
  await expect(page.getByText("Regression suite")).toBeVisible();
});

test("booking page renders a graceful unconfigured state", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByTestId("booking-fallback")).toBeVisible();
  await expect(page.getByRole("link", { name: /email/i })).toHaveAttribute("href", /^mailto:/);
});

test("mobile menu is keyboard and touch accessible", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
});

for (const route of ["/", "/services", "/work", "/book"]) {
  test(`has no automatically detectable accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
