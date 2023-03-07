import { Message } from "whatsapp-web.js";
import BotModel from "../models/bot";
import { timer } from "./timer";
import { botPreguntas, botRespuestas } from "./botMessages";
import ConfigModel from "../models/config";

export async function autoResponse(message: Message) {
  const { from, body } = message;
  const typingTime = await ConfigModel.findOne({
    key: "timeout_typing",
  }).then((config) => config?.value);
  const timeBetweenMessages = await ConfigModel.findOne({
    key: "timeout",
  }).then((config) => config?.value);

  let timeout_typing = isNaN(Number(typingTime))
    ? 60 * 1000
    : Number(typingTime) * 1000 * 60;
  let timeout = isNaN(Number(timeBetweenMessages))
    ? 60 * 1000
    : Number(timeBetweenMessages) * 1000 * 60;

  const chat = await message.getChat();
  const bot = await BotModel.findOne({ me: from });

  if (bot) {
    if (body.includes("$")) {
      await chat.sendStateTyping();
      await timer(timeout_typing);
      await chat.sendStateTyping();
      await timer(timeout);
      await chat.sendMessage(
        "Lo siento, pero me tengo que ir. En un rato hablamos 😪$"
      );
      await message.react("👍");
    }
    if (body.includes("?")) {
      let randomMessage =
        botRespuestas[Math.floor(Math.random() * botRespuestas.length)];
      await chat.sendStateTyping();
      await timer(timeout_typing);
      await chat.sendStateTyping();
      await timer(timeout);
      await chat.sendMessage(randomMessage);
    }

    if (body.includes("#")) {
      let randomMessage =
        botPreguntas[Math.floor(Math.random() * botPreguntas.length)];
      await chat.sendStateTyping();
      await timer(timeout_typing);
      await chat.sendStateTyping();
      await timer(timeout);
      await chat.sendMessage(randomMessage);
    }
  } else {
    console.log("No es un bot");
    return;
  }
}
