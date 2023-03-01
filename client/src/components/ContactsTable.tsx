import { createColumnHelper } from "@tanstack/react-table";
import { RiCheckboxBlankCircleFill, RiInformationFill } from "react-icons/ri";
import ReactDOMServer from "react-dom/server";
import { useState } from "react";
import Table from "./common/Table";

interface Props {
  data: any[];
}

export default function ContactsTable({ data }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("phone", {
      header: "Teléfono",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("valid", {
      header: "¿Es válido?",
      cell: (info) => (
        <RiCheckboxBlankCircleFill
          className={`mx-auto ${
            Boolean(info.getValue()) ? "text-green-500" : "text-rose-800"
          }`}
        />
      ),
      size: 10,
      maxSize: 10,
      minSize: 10,
    }),
    columnHelper.accessor("info", {
      header: "Más información",
      cell: (info) => {
        const val = info.getValue();
        let arr;
        if (typeof val !== "undefined") {
          arr = Object.keys(val).map((key) => {
            if (
              typeof val === "undefined" ||
              typeof val[key] === "undefined" ||
              typeof key === "undefined"
            )
              return { key: "undefined", value: "undefined" };
            return { key, value: val[key] };
          });
        }
        return (
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="text-cyan-700 mx-auto tool-tip"
              data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                <div className="max-w-xs bg-transparent text-white">
                  {typeof arr !== "undefined" ? (
                    <>
                      <h1 className="text-xl pb-4">Información</h1>
                      <ul className="flex flex-col flex-wrap gap-2 text-base">
                        {arr?.map((item) => (
                          <li key={item.key}>
                            <strong>{item.key}</strong>: {item.value}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <strong>Sin información extra</strong>
                  )}
                </div>
              )}
            >
              <RiInformationFill size={28} />
            </button>
          </div>
        );
      },
      size: 15,
      maxSize: 15,
      minSize: 10,
    }),
  ];
  return <>{data && <Table data={data || []} columns={columns} />}</>;
}
