import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import BookModel from "../models/book";

const getBooks = publicProcedure.query(async () => {
  const books = await BookModel.find();
  return books;
});

const createBook = publicProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const book = await BookModel.create({
        name: input.name,
        description: input.description,
      });
      return { status: "success", book };
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

export const bookRouter = router({
  getBooks,
  createBook,
});
