import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  RiQuestionAnswerLine,
  RiRobotFill,
  RiShieldCheckFill,
  RiShieldFill,
  RiTimeFill,
} from "react-icons/ri";
import PageTitle from "../components/common/PageTitle";
import { trpc } from "../trpc";
import { botStatus } from "../utils/status";
import { toast } from "react-toastify";
import Loading from "../components/common/Loading";
import { formatPhone } from "../utils/formatters";
import useUniqueStringArray from "../hooks/useUniqueStringArray";
import { useLocalStorage } from "../hooks/useLocalstorage";

export default function Interact() {
  const { botId }: { botId: any } = useParams();
  const { data, isLoading } = trpc.bot.getBots.useQuery();
  const setConfig = trpc.config.setConfig.useMutation();
  const startInteraction = trpc.bot.startConversationBetweenBots.useMutation();
  const stopInteraction = trpc.bot.finishConversationBetweenBots.useMutation();

  const [botsSelected, setBotsSelected] = useUniqueStringArray([]);
  const [timeoutMax, setTimeoutMax] = useState<number>(1);
  const [timeoutMin, setTimeoutMin] = useState<number>(1);
  const [timeoutTyping, setTimeoutTyping] = useState<number>(1);
  const [isChatting, setIsChatting] = useLocalStorage("isChatting", false);

  const handleStart = () => {
    setIsChatting(true);
    startInteraction.mutateAsync(
      {
        botId,
        bots: botsSelected,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
        },
      }
    );
    setConfig.mutateAsync(
      {
        key: "is_chatting",
        value: "true",
        active: true,
      },
      {
        onSuccess: () => {
          setIsChatting(false);
        },
      }
    );
  };

  const handleStop = () => {
    setConfig.mutateAsync(
      {
        key: "is_chatting",
        value: "false",
        active: false,
      },
      {
        onSuccess: () => {
          setIsChatting(false);
        },
      }
    );
  };

  const handleTimeoutMax = (e: any) => {
    setTimeoutMax(Number(e));
    setConfig.mutateAsync({
      key: "timeout_max",
      value: e,
      active: true,
    });
  };

  const handleTimeoutMin = (e: any) => {
    setTimeoutMin(Number(e));
    setConfig.mutateAsync({
      key: "timeout_min",
      value: e,
      active: true,
    });
  };

  const handleTimeoutTyping = (e: any) => {
    setTimeoutTyping(Number(e));
    setConfig.mutateAsync({
      key: "timeout_typing",
      value: e,
      active: true,
    });
  };

  const isSelected = (id: any, yes: string, no: string) =>
    botsSelected.includes(id) ? yes : no;
  return (
    <>
      <PageTitle
        title="Interacciones entre bots"
        subtitle="Selecciona los bots con los que deseas interactuar. Selecciona el tiempo entre mensajes y pulsa el botón Comenzar!"
      >
        <div className="flex gap-2">
          <div className="flex gap-1 bg-sky-600 px-3 pt-8 pb-2 items-end relative rounded">
            <div className="desc absolute flex gap-2 top-1 left-2 items-center text-white">
              <RiTimeFill size={24} />
              <h2 className="font-bold">Tiempos</h2>
            </div>
            <input
              type="number"
              name="timeout_max"
              id="timeout_max"
              min={1}
              className="rounded border p-1 w-14 text-zinc-500 tool-tip"
              onChange={(e) => handleTimeoutMin(e.target.value)}
              value={timeoutMin}
              data-tooltip-content="Tiempo MÍNIMO entre mensajes (minutos)"
            />
            <input
              type="number"
              name="timeout_max"
              id="timeout_max"
              min={1}
              className="rounded border p-1 w-14 text-zinc-500 tool-tip"
              onChange={(e) => handleTimeoutMax(e.target.value)}
              value={timeoutMax}
              data-tooltip-content="Tiempo MÁXIMO entre mensajes (minutos)"
            />
            <input
              type="number"
              name="timeout_typing"
              id="timeout_typing"
              min={1}
              className="rounded border p-1 w-14 text-zinc-500 tool-tip"
              onChange={(e) => handleTimeoutTyping(e.target.value)}
              value={timeoutTyping}
              data-tooltip-content="El número representa la cantidad de tiempo en donde el bot aparece como 'escribiendo...'"
              data-tooltip-place="left"
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              className="bg-green-500 hover:bg-green-700 flex gap-2 items-center text-white font-bold py-2 px-4 rounded disabled:bg-zinc-500 disabled:cursor-not-allowed tool-tip"
              onClick={() => handleStart()}
              disabled={botsSelected.length === 0 || isChatting}
              data-tooltip-content={`${
                botsSelected.length === 0
                  ? "Debes seleccionar al menos un bot"
                  : ""
              }`}
            >
              <RiQuestionAnswerLine />
              <span>Comenzar</span>
            </button>
            <button
              className="bg-rose-600 hover:bg-rose-700 flex gap-2 items-center text-white font-bold py-2 px-4 rounded disabled:bg-zinc-500 disabled:cursor-not-allowed tool-tip"
              onClick={() => handleStop()}
            >
              <RiQuestionAnswerLine />
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </PageTitle>
      <div className="w-full">
        {isLoading && <Loading />}
        <ul className="grid grid-cols-1 md:grid-cols-5 gap-2 ">
          {data
            ?.filter((bot) => bot._id !== botId && bot.status === "READY")
            .map((bot) => {
              return (
                <li
                  key={bot._id}
                  className="relative aspect-square rounded border border-cyan-700"
                >
                  <label
                    htmlFor={`check-${bot._id}`}
                    className={`absolute w-full h-full top-0 left-0 cursor-pointer rounded z-10 text-zinc-100 ${isSelected(
                      bot._id,
                      "bg-green-500",
                      "text-zinc-800"
                    )}  `}
                  >
                    <div className="content h-full">
                      <div className="grid grid-flow-col h-1/2 p-2 relative z-10">
                        <h2 className="font-bold">
                          <span>Nº </span>
                          {formatPhone(bot.me)}
                        </h2>
                        {bot.status === "READY" ? (
                          <span
                            data-tooltip-content={botStatus(bot.status)}
                            className="ml-auto"
                          >
                            <RiShieldCheckFill
                              size={24}
                              className={` tool-tip ${isSelected(
                                bot._id,
                                "text-white",
                                "text-green-500"
                              )}`}
                            />
                          </span>
                        ) : (
                          <span
                            data-tooltip-content={botStatus(bot.status)}
                            className="ml-auto"
                          >
                            <RiShieldFill
                              size={24}
                              className="text-rose-600 tool-tip"
                            />
                          </span>
                        )}
                      </div>
                      <div className="h-1/2 flex items-center justify-center z-10 relative">
                        <RiRobotFill
                          size={48}
                          className={`-mb-1 ${isSelected(
                            bot._id,
                            "text-cyan-700",
                            "text-green-500"
                          )}`}
                        />
                      </div>
                      <input
                        type="checkbox"
                        name="Seleccionar"
                        id={`check-${bot._id}`}
                        onChange={() => setBotsSelected(bot._id)}
                        className={`absolute bottom-0 appearance-none w-full h-1/6 text-center pt-2 cursor-pointer ${isSelected(
                          bot._id,
                          "text-white bg-cyan-700 before:content-['Seleccionado']",
                          "bg-green-600 text-zinc-100 before:content-[attr(name)]"
                        )}`}
                        disabled={bot.status !== "READY"}
                        aria-disabled={bot.status !== "READY"}
                      />
                    </div>
                  </label>
                </li>
              );
            })}
        </ul>
      </div>
      <ReactTooltip anchorSelect=".tool-tip" place="bottom" />
    </>
  );
}
