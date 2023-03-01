import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import ContactModel from "../models/contact";

const getContacts = publicProcedure.query(async () => {
  const contacts = await ContactModel.find();
  return contacts;
});

const getContactByBookId = publicProcedure
  .input(
    z.object({
      bookId: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const contacts: any = await ContactModel.find({ bookId: input.bookId });
      return contacts;
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

export const contactRouter = router({
  getContacts,
  getContactByBookId,
});
