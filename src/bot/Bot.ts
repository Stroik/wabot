import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { Types } from "mongoose";
import BotModel from "../models/bot";
import MessageModel from "../models/message";
import ConfigModel from "../models/config";
import { Log } from "../utils/log";
import { autoResponse } from "../utils/autoResponse";

export default class Bot extends Client {
  private status: string;
  public qr: string;
  public _id: Types.ObjectId;
  public me: string;

  constructor(id: Types.ObjectId) {
    super({
      authStrategy: new LocalAuth({
        clientId: `bot-${id}`,
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
        ],
      },
    });

    this._id = id;

    this.on("authenticated", async (asd) => {
      const newSession = await BotModel.findOneAndUpdate(
        { _id: this._id },
        { status: this.getStatus() },
        { upsert: true }
      );
      this.status = "AUTHENTICATED";
    });

    this.on("ready", async () => {
      this.status = "READY";
      const newSession = await BotModel.findOneAndUpdate(
        { _id: this._id },
        { status: this.getStatus(), me: this.info.wid._serialized },
        { upsert: true }
      );
    });

    this.on("message", async (msg) => {
      let isChatting = await ConfigModel.findOne({ key: "isChatting" }).then(
        (res) => {
          return res ? Boolean(res.value) : false;
        }
      );
      console.log("isChatting", isChatting);
      if (isChatting) {
        await autoResponse(msg);
      }
    });

    this.off("message", async (msg) => {
      const { body } = msg;
      if (body === "!done") {
        await msg.reply("okis, bye!");
      }
    });
  }

  public async init() {
    this.status = "INITIALIZING";
    const newSession = await BotModel.findOneAndUpdate(
      { _id: this._id },
      { status: this.getStatus() },
      { upsert: true }
    );
    await this.initialize();
  }

  public async startQr(size: number = 350) {
    this.on("qr", async (qr) => {
      let params = encodeURIComponent(qr);
      let uri = `https://quickchart.io/qr?size=${size}&text=${params}`;
      const botqr = await BotModel.findOneAndUpdate(
        { _id: this._id },
        { qr: uri, status: "QR_SENT" },
        { upsert: true }
      );
      this.qr = uri;
      this.status = "QR_SENT";
      let selectedBot = await BotModel.findOneAndUpdate(
        { _id: this._id },
        { status: this.status, qr: this.qr },
        { upsert: true }
      );
      Log("QR Actualizado " + this._id, "QR");
    });
  }

  public async getQrCode() {
    return this.qr;
  }

  public getStatus() {
    return this.status;
  }

  public async sendMsg(msg: {
    message: string | MessageMedia;
    phone: string;
  }): Promise<any> {
    try {
      let status = "SENDING";
      const { message, phone } = msg;
      const response = await this.sendMessage(`${phone}@c.us`, message);
      if (response) {
        const { from, to, hasMedia } = response;
        let status = "SENT";
        let botNumber = await BotModel.findOneAndUpdate(
          { _id: this._id },
          { me: from }
        );
        const newMessage = await MessageModel.create({
          text: message,
          status,
          from,
          to,
          hasMedia,
          botId: this._id,
        });
        return { response };
      } else {
        status = "FAILED";
        const newMessage = await MessageModel.create({
          text: message,
          status,
          botId: this._id,
        });
        return { response };
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  public async deleteSession() {
    await this.destroy();
    return true;
  }

  public whoAmI() {
    return this.info;
  }

  public async validateNumber(phone: string) {
    const response = await this.isRegisteredUser(`${phone}@c.us`);
    return response;
  }
}
