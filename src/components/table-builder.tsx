import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

export interface TableBuilderColumnProps {
  title: string
  options?: React.ComponentProps<typeof TableHead>
}

export function TableBuilder({
  columns,
  data,
}: {
  columns: TableBuilderColumnProps[]
  data: {
    value: ReactNode
    options?: React.ComponentProps<typeof TableCell>
  }[][]
}) {
  return (
    <div className="my-4 rounded-md border bg-white dark:border-gray-700 dark:bg-transparent">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(({ title, options }, index) => (
                <TableHead key={index} {...options}>
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, rowIndex) => {
              return (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    return (
                      <TableCell
                        key={`${rowIndex}-${cellIndex}`}
                        {...cell.options}
                      >
                        {cell.value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
