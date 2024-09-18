// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import {
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command"
// import { SearchIcon } from "lucide-react"

// declare global {
//   interface Window {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     pagefind: any
//   }
// }

// export function Search() {
//   const [open, setOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [results, setResults] = useState([])

//   const asPath = usePathname()

//   useEffect(() => {
//     async function loadPagefind() {
//       if (typeof window.pagefind === "undefined") {
//         try {
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//           window.pagefind = await import(
//             // @ts-expect-error pagefind generated after build
//             /* webpackIgnore: true */ "./pagefind/pagefind.js"
//           )
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         } catch (e) {
//           window.pagefind = {
//             debouncedSearch: () => ({
//               results: [
//                 {
//                   id: "pretzels",
//                   data: () => ({
//                     url: "/pretzels.html",
//                     meta: { title: "These pretzels are making me thirsty" },
//                     excerpt:
//                       "these <mark>pretzels</mark> are making me thirsty",
//                   }),
//                 },
//               ],
//             }),
//           }
//         }
//       }
//     }
//     void loadPagefind()
//   }, [])

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setOpen((open) => !open)
//       }
//     }
//     document.addEventListener("keydown", down)
//     return () => document.removeEventListener("keydown", down)
//   }, [])

//   useEffect(() => {
//     setOpen(false)
//     setSearchTerm("")
//     setResults([])
//   }, [asPath])

//   useEffect(() => {
//     const searchRecord = async () => {
//       if (!window.pagefind) return
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//       const search = await window.pagefind.debouncedSearch(searchTerm)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
//       setResults(search.results ?? [])
//     }

//     void searchRecord()
//   }, [searchTerm])

//   console.log({ results })
//   return (
//     <>
//       <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
//         <SearchIcon className="h-4 w-4" />
//       </Button>
//       <CommandDialog
//         open={open}
//         onOpenChange={setOpen}
//         title="Page search"
//         description="Page search"
//       >
//         <CommandInput
//           placeholder="Type a command or search..."
//           onValueChange={(searchString) => {
//             setSearchTerm(searchString)
//           }}
//         />
//         <CommandList>
//           {searchTerm && results.length === 0 ? (
//             <CommandEmpty>No results found.</CommandEmpty>
//           ) : (
//             <CommandGroup heading="Results">
//               {results.map((ele) => (
//                 <SearchResult result={ele} key={ele.id} />
//               ))}
//             </CommandGroup>
//           )}
//         </CommandList>
//       </CommandDialog>
//     </>
//   )
// }

// const SearchResult = ({ result }) => {
//   const [data, setData] = useState(null)
//   const [url, setUrl] = useState("")

//   useEffect(() => {
//     async function fetchData() {
//       const data = await result.data()
//       setData(data)

//       const path = data.url.match(/\/([^/]+)\.html$/)
//       const url = path ? path[1] : ""
//       setUrl(url)
//     }

//     fetchData()
//   }, [result])

//   const resultHtml = useMemo(() => {
//     if (!data) return ""
//     console.log({ data })
//     return data.excerpt
//   }, [data])

//   if (!data || !url) return null

//   return (
//     <CommandItem>{data.meta.title}</CommandItem>
//     //   <li>
//     //     <StyledLink href={url} onClick={handleClick}>
//     //       <StyledH3>{data.meta.title}</StyledH3>
//     //       <StyledP dangerouslySetInnerHTML={{ __html: resultHtml }} />
//     //     </StyledLink>
//     //   </li>
//   )
// }
