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

const app = express();
const appRouter = router({
  bot: botRouter,
  message: messageRouter,
  contact: contactRouter,
  book: bookRouter,
});

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
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
