import type { FullConfig, Reporter, Suite } from "@playwright/test/reporter"

class DocReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    const docOutput = suite.allTests().map((testcase) => {
      return {
        title: testcase.title,
        filter: testcase
          .titlePath()
          .filter((ele) => ele !== "")
          .splice(1)
          .map((ele) => ele.toLowerCase().replaceAll(" ", "-"))
          .join("/"),
        annotations: testcase.annotations,
        tags: testcase.tags.map((tag) => tag.replace("@", "").toLowerCase()),
        parent: testcase.parent
          .titlePath()
          .filter((ele) => ele !== "" && ele !== testcase.title)
          // in our example, we will remove the browser name and the filepath
          // if you have a different structure, feel free to change it
          .splice(2),
        location: {
          file: testcase.location.file,
          line: testcase.location.line,
        },
      }
    })

    // We need to remove the duplicate since it's possible that we have multiple projects
    // ( e.g. to test different browsers and/or headed/headless )
    // which would result in multiple entries for the same testcase
    const uniqueResults = [
      ...new Map(docOutput.map((item) => [item.filter, item])).values(),
    ]

    // Print the results to stdout so we can parse and process them in our page
    console.log(JSON.stringify(uniqueResults))
  }
}
export default DocReporter
