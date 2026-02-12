import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// Ensure proper cleanup after each test to prevent act() warnings
afterEach(() => {
  cleanup()
})

// Mock toLocaleDateString to ensure consistent date formatting across locales in tests
const originalToLocaleDateString = Date.prototype.toLocaleDateString;
Date.prototype.toLocaleDateString = function (
  _locales?: string | string[],
  options?: Intl.DateTimeFormatOptions
) {
  return originalToLocaleDateString.call(this, "en-GB", options);
};
