import { Message } from "whatsapp-web.js";
import BotModel from "../models/bot";
import { timer } from "./timer";
import { botPreguntas, botRespuestas } from "./botMessages";
import ConfigModel from "../models/config";
import { getRandomNumber } from "./getRandomNumber";

export async function autoResponse(message: Message) {
  const { from, body } = message;
  const times = await ConfigModel.find({
    key: { $in: ["timeout_min", "timeout_max", "timeout_typing"] },
  }).then((config) => config?.map((c) => c.value));

  let [timeout_min, timeout_max, timeout_typing] = times;

  let timeoutTyping = isNaN(Number(timeout_typing))
    ? 60 * 1000
    : Number(timeout_typing) * 1000 * 60;
  let timeout = getRandomNumber(timeout_min, timeout_max);

  const chat = await message.getChat();
  const bot = await BotModel.findOne({ me: from });

  if (bot) {
    if (body.includes("?")) {
      let randomMessage =
        botRespuestas[Math.floor(Math.random() * botRespuestas.length)];
      await chat.sendStateTyping();
      await timer(timeoutTyping);
      await chat.sendStateTyping();
      await timer(timeout);
      await chat.sendMessage(randomMessage);
    }

    if (body.includes("#")) {
      let randomMessage =
        botPreguntas[Math.floor(Math.random() * botPreguntas.length)];
      await chat.sendStateTyping();
      await timer(timeoutTyping);
      await chat.sendStateTyping();
      await timer(timeout);
      await chat.sendMessage(randomMessage);
    }
  } else {
    console.log("No es un bot");
    return;
  }
}
