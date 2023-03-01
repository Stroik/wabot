import mongoose from "mongoose";
import { Log } from "./utils/log";

export const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect("mongodb://127.0.0.1/wabulk");
    Log(`Conectado a: ${db.connection.name}`, "DATABASE");
  } catch (error) {
    if (error instanceof Error) {
      Log(error.message, "DATABASE ERROR");
    }
  }
};
