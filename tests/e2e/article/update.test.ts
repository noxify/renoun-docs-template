import { expect, test } from "@playwright/test"

test.describe("article Tests", { tag: ["@article"] }, () => {
  test.describe("Update Tests", { tag: ["@update"] }, () => {
    test("article update test 1", () => {
      expect(true).toBeTruthy()
    })

    test("article update test 2", () => {
      expect(true).toBeTruthy()
    })
  })
})
