import React from "react";
import {
  RiWhatsappFill,
  RiDeleteBin6Line,
  RiQrCodeLine,
  RiShieldCheckFill,
  RiShieldFill,
  RiWechatFill,
} from "react-icons/ri";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useState } from "react";
import { trpc } from "../trpc";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import { botStatus } from "../utils/status";
import Card from "../components/common/Card";
import GridSelector from "../components/GridSelector";
import { useLocalStorage } from "../hooks/useLocalstorage";

interface Bot {
  _id: string;
  me: string;
  status: string;
  qr: string;
}

export default function Bots() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [grid, setGrid] = useLocalStorage(
    "grid",
    "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
  );
  const [qrStatus, setQrStatus] = useState({
    status: "",
    message: "",
    qr: "",
    error: "",
  });
  const { data: botList, isError, isLoading } = trpc.bot.getBots.useQuery();
  const startQR = trpc.bot.startQr.useMutation();
  const getQR = trpc.bot.getQr.useMutation();
  const newBot = trpc.bot.newBot.useMutation();
  const delBot = trpc.bot.removeBot.useMutation();
  const utils = trpc.useContext();

  const handleDelete = async (id: string) => {
    setId(id);
    const confirm = window.confirm("¿Estas seguro de eliminar el bot?");
    if (confirm) {
      await delBot.mutateAsync(id);
      utils.bot.getBots.invalidate();
    }
  };

  const handleStartQR = async (id: string) => {
    setId(id);
    const data = await startQR.mutateAsync(id);
    setTitle("Codigo QR");
    setIsOpen(true);
    setQrStatus(data);
    const qrData = await getQR.mutateAsync(id);
    setQrStatus(qrData);
  };

  const handleGetQR = async (id: string) => {
    setId(id);
    setTitle("Codigo QR");
    setIsOpen(true);
    const data = await getQR.mutateAsync(id);
    setQrStatus(data);
  };

  const buttonsCards = [
    {
      icon: <RiQrCodeLine size={20} className="tool-tip" />,
      onClick: (id: string) => handleStartQR(id),
      label: "QR",
      style: "bg-green-500 text-white hover:opacity-90",
      show: true,
      "data-tooltip-content": "Solicitar codigo QR",
    },
    {
      icon: <RiDeleteBin6Line size={20} className="tool-tip" />,
      onClick: (id: string) => handleDelete(id),
      label: "Eliminar",
      style: "bg-pink-700 text-white hover:opacity-90",
      show: true,
      "data-tooltip-content": "Eliminar Whatsapp",
    },
  ];

  if (isLoading) return <Loading />;
  if (isError) return <h1>Error</h1>;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-4 pb-2 border-b">
        <h1 className="text-3xl">Estado y registro de Whatsapps</h1>
        <button
          className="rounded px-4 py-2 text-white bg-cyan-700 flex items-center gap-2"
          onClick={() => {
            newBot.mutateAsync("", {
              onSuccess: (data) => {
                utils.bot.getBots.invalidate();
              },
            });
          }}
        >
          <RiWhatsappFill size={28} className="text-green-500" />
          <span>Agregar nuevo</span>
        </button>
      </div>
      <p className="">
        En esta sección se listan todos los whatsapp que se agregaron y el
        estado de conexión que tienen.
        <br /> Para agregar un nuevo Whatsapp, sólo hay que dar click en el
        botón azul.
      </p>
      <div className="flex items-center justify-end">
        <GridSelector grid={grid} setGrid={setGrid} />
      </div>
      <div className={`grid w-full gap-2 mt-4 ${grid} bg-zinc-100 p-4 rounded`}>
        {botList &&
          botList.map((bot, i) => {
            const { _id, me, status } = bot;
            return (
              <Card
                key={i}
                title={me ? `Nº ${me.split("@")[0]}` : "No registrado"}
                status={
                  status === "READY" ? (
                    <RiShieldCheckFill
                      size={24}
                      className="text-green-500 tool-tip"
                      data-tooltip-content="Conectado y listo para usar"
                      data-tooltip-place="top"
                    />
                  ) : (
                    <RiShieldFill
                      size={24}
                      className="text-red-500 tool-tip "
                      data-tooltip-content="Desconectado"
                      data-tooltip-place="top"
                    />
                  )
                }
                buttons={buttonsCards}
                id={_id}
              >
                <RiWhatsappFill size={56} className="text-green-500" />
                <Modal
                  title={title}
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  onConfirm={() => console.log("Confirm!")}
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
                        onClick={() => handleGetQR(_id)}
                      >
                        Actualizar
                      </button>
                    </div>
                  </div>
                </Modal>
              </Card>
            );
          })}
      </div>
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </div>
  );
}
