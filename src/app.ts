import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext, router } from "./trpc";
import { botRouter } from "./routes/bot";
import { messageRouter } from "./routes/message";
import { contactRouter } from "./routes/contact";
import { bookRouter } from "./routes/book";
import { configRouter } from "./routes/config";

const app = express();
const appRouter = router({
  bot: botRouter,
  message: messageRouter,
  contact: contactRouter,
  book: bookRouter,
  config: configRouter,
});

app.use(morgan("dev"));
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}:${process.env.CLIENT_URL_PORT}`,
  })
);
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    batching: {
      enabled: true,
    },
  })
);

export type AppRouter = typeof appRouter;

export default app;
