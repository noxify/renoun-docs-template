import { expect, test } from "@playwright/test"

test.describe("article Tests", { tag: ["@article"] }, () => {
  test.describe("Read Tests", { tag: ["@read"] }, () => {
    test("article read test 1", () => {
      expect(true).toBeTruthy()
    })

    test("article read test 2", () => {
      expect(true).toBeTruthy()
    })
  })
})
