import * as dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { Log } from "./utils/log";
import { dbConnect } from "./db";

const PORT = process.env.API_PORT || 3000;

const start = async () => {
  await dbConnect();
  app.listen(PORT, () => {
    Log(`Servidor abierto en el puerto ${PORT}`, "SERVER");
  });
};
process.setMaxListeners(50);
setImmediate(start);
