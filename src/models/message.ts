import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class MessageModel {
  @prop({ type: String }) botId: string;
  @prop({ type: String }) text: string;
  @prop({ type: String }) status: string;
  @prop({ type: String }) from: string;
  @prop({ type: String }) to: string;
  @prop({ type: Boolean }) hasMedia: boolean;
  @prop({ type: Buffer }) media: Buffer;
}

export default getModelForClass(MessageModel);
