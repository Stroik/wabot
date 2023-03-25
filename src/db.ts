import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import { Log } from "./utils/log";

export const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect(
      `${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`
    );
    Log(`Conectado a: ${db.connection.name}`, "DATABASE");
    Log(
      `DATABASE_URL: ${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`,
      "DATABASE"
    );
  } catch (error) {
    if (error instanceof Error) {
      Log(error.message, "DATABASE ERROR");
      Log(
        `DATABASE_URL: ${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`,
        "DATABASE"
      );
    }
  }
};
