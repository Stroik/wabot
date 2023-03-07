import ConfigModel from "../models/config";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const setConfig = publicProcedure
  .input(
    z
      .object({
        key: z.string(),
        value: z.string(),
        active: z.boolean(),
      })
      .required()
  )
  .mutation(async ({ input }) => {
    try {
      const config = await ConfigModel.findOneAndUpdate(
        { key: input.key },
        { value: String(input.value) },
        { upsert: true }
      );
      return config;
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", error: error.message };
      }
    }
  });

export const configRouter = router({
  setConfig,
});
