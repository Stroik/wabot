import MessageModel from "../models/message";
import { publicProcedure, router } from "../trpc";

const getMessages = publicProcedure.query(async () => {
  const messages = await MessageModel.find();
  return messages;
});

export const messageRouter = router({
  getMessages,
});
