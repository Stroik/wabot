import Bot from "./Bot";
import { Types } from "mongoose";
import BotModel from "../models/bot";
import { botPreguntas } from "../utils/botMessages";
import { timer } from "../utils/timer";
import { Log } from "../utils/log";

export default class BotManager {
  private bots: Bot[] = [];

  public addBot(id: Types.ObjectId): Bot {
    const bot = new Bot(id);
    this.bots.push(bot);
    return bot;
  }

  public getBot(id: string) {
    let bot = this.bots.find((bot) => {
      return bot._id.equals(id);
    });
    return bot;
  }

  public getBots(): Bot[] {
    return this.bots;
  }

  public getBotsByIds(ids: string[]): Bot[] {
    let bots = this.bots.filter((bot) => {
      return ids.includes(bot._id.toString());
    });
    return bots;
  }

  public async removeBot(id: string): Promise<any> {
    this.bots = this.bots.filter((bot) => {
      return !bot._id.equals(id);
    });

    const removedBot = await BotModel.findOneAndRemove({ _id: id });
    if (removedBot) {
      console.log(`Removed bot with id ${id}`);
    }
  }

  public async registerBots(): Promise<void> {
    const bots = await BotModel.find();
    bots.forEach((bot) => {
      let newBot = this.addBot(bot._id);
      newBot.init();
    });
  }
}

const botManager = new BotManager();
botManager.registerBots();

export { botManager };
