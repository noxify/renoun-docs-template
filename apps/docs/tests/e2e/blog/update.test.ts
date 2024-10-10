import { expect, test } from "@playwright/test";

test.describe("Blog Tests", { tag: ["@blog"] }, () => {
  test.describe("Update Tests", { tag: ["@update"] }, () => {
    test("Blog update test 1", () => {
      expect(true).toBeTruthy();
    });

    test("Blog update test 2", () => {
      expect(true).toBeTruthy();
    });
  });
});
