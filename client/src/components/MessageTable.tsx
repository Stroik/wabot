import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { trpc } from "../trpc";
import Table from "./common/Table";
import Loading from "./common/Loading";
import { messageStatus } from "../utils/status";
import { RiCheckboxCircleFill, RiCloseCircleFill } from "react-icons/ri";
import { formatPhone } from "../utils/formatters";

interface Message {
  _id: string;
  botId: string;
  from: string;
  text: string;
  to: string;
  status: string;
}

export default function MessageTable() {
  const columnHelper = createColumnHelper<Message>();
  const { data, isLoading } = trpc.message.getMessages.useQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor("_id", {
        header: "",
        cell: (row) => (
          <span className="text-gray-500 font-bold">
            {row.cell.row.index + 1}
          </span>
        ),
        size: 5,
      }),
      columnHelper.accessor("from", {
        header: "Whatsapp Nº",
        cell: (row) => {
          let numb = row.getValue();
          let botNumber = numb.split("@")[0];
          return formatPhone(botNumber);
        },
      }),
      columnHelper.accessor("text", {
        header: "Mensaje",
        cell: (row) => {
          let text = row.getValue();
          let shortMsg = text.substring(0, 30);
          return (
            <p
              className="tool-tip"
              data-tooltip-html={`
              <div class="w-[225px]">
                <p">${text}</p>
              </div>
            `}
            >
              {shortMsg}...
            </p>
          );
        },
        size: 150,
        maxSize: 200,
        minSize: 100,
      }),
      columnHelper.accessor("to", {
        header: "Contacto Nº",
        cell: (row) => {
          let numb = row.getValue();
          let contactNumber = numb.split("@")[0];
          return (
            <span className=" text-zinc-700">{formatPhone(contactNumber)}</span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Estado",
        cell: (row) => (
          <span>
            {messageStatus(row.getValue()) === "Enviado" ? (
              <span className="text-green-500 flex justify-center items-center">
                {messageStatus(row.getValue())}{" "}
                <RiCheckboxCircleFill className="ml-1" size={18} />
              </span>
            ) : (
              <span className="text-red-500 flex justify-center items-center">
                {messageStatus(row.getValue())}{" "}
                <RiCloseCircleFill className="ml-1" size={18} />
              </span>
            )}
          </span>
        ),
      }),
    ],
    []
  );
  if (isLoading) return <Loading />;
  return (
    <>
      <Table columns={columns} data={data || []} />
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </>
  );
}
