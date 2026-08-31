import fs from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const url = process.env.LIGHTHOUSE_URL || "http://localhost:3001";
const chromePath = process.env.CHROME_PATH;
const desktop = process.env.LIGHTHOUSE_PRESET === "desktop";
const outputPath = path.resolve(`reports/lighthouse-${desktop ? "desktop" : "mobile"}.json`);
const profilePath = path.resolve("reports/.lighthouse-profile");

if (!chromePath) {
  throw new Error("Set CHROME_PATH to a Chromium or Chrome executable before running the audit.");
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(profilePath, { recursive: true });

const chrome = await launch({
  chromePath,
  userDataDir: profilePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

try {
  const result = await lighthouse(url, {
    port: chrome.port,
    preset: desktop ? "desktop" : undefined,
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    logLevel: "error",
  });

  if (!result) throw new Error("Lighthouse did not return an audit result.");
  const report = Array.isArray(result.report) ? result.report[0] : result.report;
  await fs.writeFile(outputPath, report, "utf8");

  const scores = Object.fromEntries(
    Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round((category.score || 0) * 100)]),
  );
  console.log(JSON.stringify({ url: result.lhr.finalUrl, scores }, null, 2));
} finally {
  if (chrome.pid) process.kill(chrome.pid);
  process.exit(0);
}
