import { expect, test } from "@playwright/test"

test.describe("Blog Tests", { tag: ["@blog"] }, () => {
  test.describe("Read Tests", { tag: ["@read"] }, () => {
    test("Blog read test 1", () => {
      expect(true).toBeTruthy()
    })

    test("Blog read test 2", () => {
      expect(true).toBeTruthy()
    })
  })
})
