import { Message } from "whatsapp-web.js";
import BotModel from "../models/bot";
import { timer } from "./timer";
import { botPreguntas, botRespuestas } from "./botMessages";

export async function autoResponse(message: Message) {
  const { from, body } = message;
  const typingTime = Math.floor(Math.random() * 15000);
  const timeBetweenMessages = Math.floor(Math.random() * 15000);
  const chat = await message.getChat();
  const bot = await BotModel.findOne({ me: from });
  if (bot) {
    if (body.includes("$")) {
      await chat.sendStateTyping();
      await timer(typingTime);
      await chat.sendStateTyping();
      await timer(timeBetweenMessages);
      await chat.sendMessage(
        "Lo siento, pero me tengo que ir. En un rato hablamos"
      );
    }
    if (body.includes("?")) {
      let randomMessage =
        botRespuestas[Math.floor(Math.random() * botRespuestas.length)];
      await chat.sendStateTyping();
      await timer(typingTime);
      await chat.sendStateTyping();
      await timer(timeBetweenMessages);
      await chat.sendMessage(randomMessage);
    }

    if (body.includes("#")) {
      let randomMessage =
        botPreguntas[Math.floor(Math.random() * botPreguntas.length)];
      await chat.sendStateTyping();
      await timer(typingTime);
      await chat.sendStateTyping();
      await timer(timeBetweenMessages);
      await chat.sendMessage(randomMessage);
    }
  }
}
