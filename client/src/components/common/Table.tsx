import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RiArrowLeftSFill,
  RiArrowRightSFill,
  RiSortAsc,
  RiSortDesc,
} from "react-icons/ri";

interface Button {
  label: any;
  onClick: () => void;
  color: string;
}

interface Props {
  data: Array<any>;
  columns: Array<any>;
  buttons?: Array<Button>;
}

export default function Table({ columns, data, buttons }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {buttons ? (
        <div className="flex justify-end py-2">
          {buttons.map((button) => (
            <button
              key={button.label}
              className={`${button.color} text-white py-2 px-4 rounded`}
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      ) : null}
      <table className="w-full text-center bg-zinc-100 rounded">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="pt-4 pb-4 bg-cyan-800 text-white"
                  style={{ width: header.getSize() }}
                >
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none flex items-center justify-center gap-2"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: <RiSortAsc />,
                      desc: <RiSortDesc />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-zinc-200 odd:bg-zinc-100 even:bg-zinc-200"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between gap-2 py-4">
        <button
          className="border rounded aspect-square block px-2 bg-cyan-600 text-white disabled:bg-zinc-400"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <RiArrowLeftSFill size={18} />
        </button>
        <span className="flex items-center gap-1">
          <div>Página </div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          className="border rounded aspect-square block px-2 bg-cyan-600 text-white disabled:bg-zinc-400"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <RiArrowRightSFill size={18} />
        </button>
      </div>
    </div>
  );
}
