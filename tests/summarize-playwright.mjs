import fs from "node:fs";

const reportPath = "test-results/report.json";
if (!fs.existsSync(reportPath)) {
  fs.appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    "Playwright report was not created.\n",
  );
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const failures = [];

function visit(suite, parents = []) {
  const titles = [...parents, suite.title].filter(Boolean);
  for (const spec of suite.specs ?? []) {
    const title = [...titles, spec.title].join(" › ");
    for (const test of spec.tests ?? []) {
      for (const result of test.results ?? []) {
        if (result.status !== "failed" && result.status !== "timedOut")
          continue;
        const message =
          result.errors
            ?.map((error) => error.message)
            .filter(Boolean)
            .join("\n\n") || result.status;
        failures.push({ title, message });
      }
    }
  }
  for (const child of suite.suites ?? []) visit(child, titles);
}

for (const suite of report.suites ?? []) visit(suite);

const summary = failures.length
  ? [
      "## Playwright failures",
      ...failures.map(
        ({ title, message }) =>
          `### ${title}\n\n\`\`\`text\n${message}\n\`\`\``,
      ),
    ].join("\n\n")
  : `Playwright passed: ${report.stats?.expected ?? 0} tests.`;

fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
