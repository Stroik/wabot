import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class BotModel {
  @prop({ type: String }) id: string;
  @prop({ type: String }) status: string;
  @prop({ type: String }) qr: string;
  @prop({ type: String }) me: string;
}

export default getModelForClass(BotModel);
