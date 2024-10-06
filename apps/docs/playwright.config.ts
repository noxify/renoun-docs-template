import { defineConfig, devices } from "@playwright/test"
import DocReporter from "@tests/doc-reporter"

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: "tests",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use a custom launch options object instead of the default one.
        launchOptions: {},
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Chrome"],
        // Use a custom launch options object instead of the default one.
        launchOptions: {},
      },
    },
  ],
})
