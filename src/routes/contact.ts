import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import ContactModel from "../models/contact";
import BookModel from "../models/book";

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

const createContacts = publicProcedure
  .input(
    z.object({
      contacts: z.array(
        z.object({
          bookId: z.string(),
          phone: z.string(),
          valid: z.boolean(),
          info: z.object({}).optional(),
        })
      ),
      bookId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const contacts = await ContactModel.insertMany(input.contacts);
      const book = await BookModel.findOneAndUpdate(
        { _id: input.bookId },
        { count: contacts.length }
      );
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
  createContacts,
});
