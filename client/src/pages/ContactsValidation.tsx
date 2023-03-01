import { useState, useMemo, useEffect } from "react";
import UploadCsv from "../components/UploadCsv";
import Table from "../components/common/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";

export default function ContactsValidation() {
  const [data, setData] = useState<any>([]);
  const [showExport, setShowExport] = useState<boolean>(false);
  const columnHelper = createColumnHelper<any>();

  const handleColumns = (data: any) => {
    let columns = [];
    for (let key in data[0]) {
      if (key === "status") continue;
      columns.push(
        columnHelper.accessor(key, {
          header: key,
        })
      );
    }
    columns.unshift(
      columnHelper.accessor("index", {
        header: "#",
        id: "index",
        cell: (row: any) => (
          <span className="text-gray-500 font-bold px-2">
            {row.cell.row.index + 1}
          </span>
        ),
        size: 5,
        maxSize: 10,
        minSize: 5,
      })
    );

    columns.push(
      columnHelper.accessor("status", {
        header: "",
        id: "validate",
        cell: (row: any) => {
          const status = row.getValue();
          return (
            <span className="flex gap-1 px-2">
              {status === "ok" ? (
                <RiCheckboxFill
                  size={20}
                  className="text-green-600"
                  key={row.cell.row.index + 1}
                />
              ) : (
                <RiCheckboxBlankLine
                  size={20}
                  className="text-rose-800"
                  key={row.cell.row.index + 1}
                />
              )}
            </span>
          );
        },
        size: 20,
        maxSize: 20,
        minSize: 5,
      })
    );

    return columns;
  };
  const validateNumbers = async () => {
    console.log("Validating numbers");
    let datos: object[] = [];
    data.forEach((item: any) => {
      item.status = "ok";
      datos.push(item);
    });
    setData(datos);
  };

  const columns = useMemo(() => handleColumns(data), [data]);

  useEffect(() => {
    if (data.length > 0) {
      setShowExport(true);
    }
  }, [data]);

  return (
    <div>
      <UploadCsv setState={setData} labels={["Contactos", "Subir contactos"]} />
      {data.length > 0 && (
        <div className="flex flex-col w-full py-4">
          <div className="flex justify-end gap-2">
            {showExport && (
              <button
                className="rounded px-4 py-2 bg-green-500 text-white hover:opacity-90 my-4"
                onClick={validateNumbers}
              >
                Guardar contactos
              </button>
            )}
            <button
              className="rounded px-4 py-2 bg-cyan-700 text-white hover:opacity-90 my-4"
              onClick={validateNumbers}
            >
              Validar
            </button>
          </div>
          <Table data={data} columns={columns} />
        </div>
      )}
    </div>
  );
}
