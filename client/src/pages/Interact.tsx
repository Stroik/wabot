import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RiQuestionAnswerLine } from "react-icons/ri";
import PageTitle from "../components/common/PageTitle";
import { trpc } from "../trpc";
import { botStatus } from "../utils/status";
import { toast } from "react-toastify";
import Loading from "../components/common/Loading";

export default function Interact() {
  const { botId }: { botId: any } = useParams();
  const { data, isLoading } = trpc.bot.getBots.useQuery();
  const setConfig = trpc.config.setConfig.useMutation();
  const startInteraction = trpc.bot.startConversationBetweenBots.useMutation();

  const [botsSelected, setBotsSelected] = useState<any>([]);
  const [time, setTime] = useState<number>(1);

  const handleSelect = (bot: any) => {
    const botIndex = botsSelected.findIndex((b: any) => b._id === bot._id);
    if (botIndex === -1) {
      setBotsSelected([...botsSelected, bot._id]);
    } else {
      const newBots = [...botsSelected];
      newBots.splice(botIndex, 1);
      setBotsSelected(newBots);
    }
  };

  const handleStart = () => {
    startInteraction.mutateAsync(
      {
        botId,
        bots: botsSelected,
        timeout: Number(time),
      },
      {
        onSuccess: (data) => {
          console.log(data);
          toast.success(data.message);
        },
      }
    );
  };

  const handleTimeout = (e: any) => {
    setTime(Number(e));
    setConfig.mutateAsync(
      {
        key: "timeout",
        value: e,
        active: true,
      },
      {
        onSuccess: (data) => {},
      }
    );
  };

  return (
    <>
      <PageTitle
        title="Interacciones entre bots"
        subtitle="Selecciona los bots con los que deseas interactuar. Selecciona el tiempo entre mensajes y pulsa el botón Comenzar!"
      >
        <div className="flex gap-2">
          <input
            type="number"
            name="time"
            id="time"
            min={1}
            className="rounded border px-2 py-2 w-24 text-zinc-500 tool-tip"
            onChange={(e) => handleTimeout(e.target.value)}
            value={time}
            data-tooltip-content="Tiempo entre mensajes (minutos)"
          />
          <button
            className="bg-green-500 hover:bg-green-700 flex gap-2 items-center text-white font-bold py-2 px-4 rounded disabled:bg-zinc-500 disabled:cursor-not-allowed"
            onClick={() => handleStart()}
            disabled={botsSelected.length === 0}
          >
            <RiQuestionAnswerLine />
            <span>Comenzar</span>
          </button>
        </div>
      </PageTitle>
      <div className="">
        {isLoading && <Loading />}
        <ul>
          {data
            ?.filter((bot) => bot._id !== botId)
            .map((bot) => {
              return (
                <li key={bot._id}>
                  <div className="flex gap-2 items-center justify-center">
                    <h2 className="flex gap-2">
                      {bot.me} |
                      <span className="text-green-500 font-bold">
                        {botStatus(bot.status)}
                      </span>
                    </h2>
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => handleSelect(bot)}
                    />
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <ReactTooltip anchorSelect=".tool-tip" place="bottom" />
    </>
  );
}
