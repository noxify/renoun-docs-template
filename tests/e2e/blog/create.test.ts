import { expect, test } from "@playwright/test"

test.describe("Blog Tests", { tag: ["@blog"] }, () => {
  test.describe("Create Tests", { tag: ["@create"] }, () => {
    test("Blog create test 1", () => {
      expect(true).toBeTruthy()
    })

    test("Blog create test 2", () => {
      expect(true).toBeTruthy()
    })
  })
})
