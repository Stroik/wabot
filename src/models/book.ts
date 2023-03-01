import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class BookModel {
  @prop({ type: String, required: true }) name: string;
  @prop({ type: String }) description: string;
  @prop({ type: Number }) count: number;
}

export default getModelForClass(BookModel);
