import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import BotModel from "../models/bot";
import { Types } from "mongoose";
import { botManager } from "../bot/BotManager";
import { timer } from "../utils/timer";
import { MessageMedia } from "whatsapp-web.js";
import Bot from "../bot/Bot";
import { botPreguntas } from "../utils/botMessages";

const getBots = publicProcedure.query(async () => {
  const bots = await BotModel.find();
  return bots;
});

const newBot = publicProcedure.input(z.string()).mutation(({ input }) => {
  try {
    const id = new Types.ObjectId();
    const bot = botManager.addBot(id);
    bot.init();
    return { status: "success", id: id };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", error: error.message };
    }
  }
});

const removeBot = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    try {
      await botManager.removeBot(input);

      return {
        status: "success",
        messsage: `Whatsapp ${input} fue eliminado.`,
      };
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

const startQr = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    try {
      const bot = botManager.getBot(input);
      if (bot) {
        bot.startQr();
        return { status: "success", message: "QR_SERVICE_STARTING", qr: "" };
      } else return { status: "error", error: "Bot not found", qr: "" };
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message, qr: "" };
      }
    }
  });

const getQr = publicProcedure.input(z.string()).mutation(async ({ input }) => {
  try {
    const bot = await BotModel.findOne({ _id: input });
    if (bot) {
      return { status: "success", qr: bot.qr, message: "QR_GENERATED" };
    } else return { status: "error", error: "Bot not found" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", error: error.message };
    }
  }
});

const sendBulk = publicProcedure
  .input(
    z.object({
      data: z.array(
        z.object({
          phone: z.string(),
          message: z.string(),
        })
      ),
      timeout: z.number(),
      url: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { data, timeout, url } = input;
    const timeBetweenMessages = timeout ? timeout * 1000 : 1000;
    let media;
    if (url) {
      media = await MessageMedia.fromUrl(url);
    }
    try {
      const bots = botManager.getBots();
      if (bots.length > 0) {
        for (const message of data) {
          const bot = bots[Math.floor(Math.random() * bots.length)];
          if (media) {
            await bot.sendMsg({
              phone: message.phone,
              message: message.message,
              media,
            });
          } else {
            await bot.sendMsg({
              phone: message.phone,
              message: message.message,
            });
          }
          await timer(timeBetweenMessages);
        }
        return { status: "success", message: "Mensajes enviados" };
      } else {
        return { status: "error", error: "No hay bots disponibles" };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

const doValidate = async (input: object[], bot: Bot) => {
  let validNumbers: any[] = [];
  let invalidNumbers: any[] = [];
  const doValidation: any[] = await Promise.allSettled(
    input.map(async (contact: any) => {
      let phone = contact?.phone || contact?.telefono;
      await timer(1000);
      const response = await bot.validateNumber(phone);
      if (response) {
        contact.valid = true;
        validNumbers.push(contact);
      } else {
        invalidNumbers.push(contact);
      }
    })
  );
  return { validNumbers, invalidNumbers };
};

const validateNumbers = publicProcedure
  .input(
    z.array(
      z.object({
        phone: z.string(),
        valid: z.boolean().optional(),
        info: z.object({}).optional(),
      })
    )
  )
  .mutation(async ({ input }) => {
    try {
      const bots = botManager.getBots();
      if (bots.length > 0) {
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const response = await doValidate(input, bot);
        return { status: "success", result: response };
      } else {
        return { status: "error", error: "No hay bots disponibles" };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error };
      }
    }
  });

const startConversationBetweenBots = publicProcedure
  .input(
    z.object({
      botId: z.string(),
      bots: z.array(z.string()),
    })
  )
  .mutation(async ({ input }) => {
    const { botId, bots }: { botId: string; bots: string[]; timeout?: number } =
      input;

    try {
      const selectedBots = botManager.getBotsByIds(bots);
      const sender = botManager.getBot(botId);
      if (bots && sender) {
        for (let i = 0; i < bots.length; i++) {
          let question =
            botPreguntas[Math.floor(Math.random() * botPreguntas.length)];
          const bot = selectedBots[i];
          await sender.sendMessage(bot.info.wid._serialized, question);
          await timer(5000);
        }
        return { status: "success", message: "La interacción ha comenzado" };
      } else {
        return { status: "error", error: "No hay bots disponibles" };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

const finishConversationBetweenBots = publicProcedure
  .input(
    z.object({
      botId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { botId }: { botId: string } = input;

    try {
      const bots = botManager.getBots();
      const sender = botManager.getBot(botId);

      if (bots && sender) {
        for (let i = 0; i < bots.length; i++) {
          const bot = bots[i];
          await sender.sendMessage(bot.info.wid._serialized, "!done");
          await timer(5000);
        }
        return { status: "success", message: "La interacción ha finalizado" };
      } else {
        return { status: "error", error: "No hay bots disponibles" };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

export const botRouter = router({
  getBots,
  newBot,
  removeBot,
  startQr,
  getQr,
  sendBulk,
  validateNumbers,
  startConversationBetweenBots,
  finishConversationBetweenBots,
});
