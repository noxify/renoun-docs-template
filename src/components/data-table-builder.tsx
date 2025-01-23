"use client"

import type { SortingState } from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTablePagination } from "./data-table-pagination"

export interface DataTableProps<TData> {
  columns: { id: string; title: string }[]
  data: TData[]
}

export function DataTableBuilder<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columnHelper = createColumnHelper<TData>()

  const tableColumns = [
    ...columns.map((columnDef) => {
      // @ts-expect-error not sure how to type this
      // but shouldn't be a problem in our case :)
      return columnHelper.accessor(columnDef.id, {
        id: columnDef.id,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={columnDef.title} />
        ),
      })
    }),
  ]

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="my-4">
      <div className="rounded-md border bg-white dark:border-gray-700 dark:bg-transparent">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
