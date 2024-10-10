import { expect, test } from "@playwright/test";

test.describe("Article Tests", { tag: ["@article"] }, () => {
  test.describe("Create Tests", { tag: ["@create"] }, () => {
    test("article create test 1", () => {
      expect(true).toBeTruthy();
    });

    test("article create test 2", () => {
      expect(true).toBeTruthy();
    });
  });
});
