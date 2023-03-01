import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import BotModel from "../models/bot";
import { Types } from "mongoose";
import { botManager } from "../bot/BotManager";
import { Log } from "../utils/log";
import { timer } from "../utils/timer";
import { MessageMedia } from "whatsapp-web.js";
import Bot from "../bot/Bot";

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
      let bot = botManager.getBot(input);
      if (bot) {
        bot.deleteSession();
      }
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
          await bot.sendMsg(message);
          if (media) {
            await bot.sendMsg({ message: media, phone: message.phone });
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

export const botRouter = router({
  getBots,
  newBot,
  removeBot,
  startQr,
  getQr,
  sendBulk,
  validateNumbers,
});
