import { createColumnHelper } from "@tanstack/react-table";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { trpc } from "../trpc";
import Modal from "./common/Modal";
import Table from "./common/Table";
import { useState } from "react";
import { RiDeleteBin6Line, RiQrCodeLine, RiWhatsappFill } from "react-icons/ri";
import Loading from "./common/Loading";
import { botStatus } from "../utils/status";

interface Bot {
  _id: string;
  status: string;
  qr: string;
  me: string;
}

interface QrStatus {
  status: string;
  message: string;
  qr: string;
  error: string;
}

export default function BotTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [qrStatus, setQrStatus] = useState<QrStatus>({
    status: "",
    message: "",
    qr: "",
    error: "",
  });

  const columnHelper = createColumnHelper<Bot>();
  const { data: botList, isError, isLoading } = trpc.bot.getBots.useQuery();
  const startQR = trpc.bot.startQr.useMutation();
  const getQR = trpc.bot.getQr.useMutation();
  const newBot = trpc.bot.newBot.useMutation();
  const delBot = trpc.bot.removeBot.useMutation();
  const utils = trpc.useContext();
  const buttons = [
    {
      label: <AddWhatsapp />,
      onClick: () => {
        newBot.mutateAsync("", {
          onSuccess: (data) => {
            utils.bot.getBots.invalidate();
          },
        });
      },
      color: "bg-cyan-600",
    },
  ];

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("¿Estas seguro de eliminar el bot?");
    if (confirm) {
      delBot.mutateAsync(id, {
        onSuccess: (data) => {
          utils.bot.getBots.invalidate();
        },
      });
    }
  };

  const handleStartQR = async (id: string) => {
    startQR.mutateAsync(id, {
      onSuccess: (data: any) => {
        setTitle("Codigo QR");
        setIsOpen(true);
        setQrStatus(data);
        getQR.mutateAsync(id, {
          onSuccess: (data: any) => {
            setQrStatus(data);
          },
        });
      },
    });
  };

  const handleGetQR = async (id: string) => {
    setTitle("Codigo QR");
    setIsOpen(true);
    getQR.mutateAsync(id, {
      onSuccess: (data: any) => {
        setQrStatus(data);
      },
    });
  };

  const columns = [
    columnHelper.accessor("me", {
      cell: (info) => {
        let me = info.getValue();
        let botNumber = me.split("@")[0];
        return botNumber;
      },
      header: "Número",
    }),
    columnHelper.accessor("status", {
      cell: (info) => botStatus(info.getValue()),
      header: "Estado",
    }),
    columnHelper.accessor("_id", {
      cell: (info) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleStartQR(info.getValue())}
            className="tool-tip"
            data-tooltip-content="Solicitar QR"
            data-tooltip-place="top"
          >
            <RiQrCodeLine size={24} />
          </button>
          <button
            onClick={() => handleDelete(info.getValue())}
            className="tool-tip"
            data-tooltip-content="Eliminar Whatsapp"
            data-tooltip-place="top"
          >
            <RiDeleteBin6Line size={24} className="text-rose-700" />
          </button>
          <Modal
            title={title}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center gap-1">
              <div className="flex flex-col">
                {qrStatus.qr === "" ? (
                  <Loading />
                ) : (
                  <img src={qrStatus.qr} alt="qr" />
                )}
                <button
                  className="px-4 py-2 rounded bg-blue-500 text-white"
                  onClick={() => handleGetQR(info.getValue())}
                >
                  Actualizar
                </button>
              </div>
            </div>
          </Modal>
        </div>
      ),
      header: "Opciones",
    }),
  ];

  return (
    <>
      <Table
        columns={columns}
        data={botList ? botList : []}
        buttons={buttons}
      />
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </>
  );
}

function AddWhatsapp() {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <span>Nuevo</span>
      <RiWhatsappFill size={24} />
    </div>
  );
}
