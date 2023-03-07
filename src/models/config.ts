import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ConfigModel {
  @prop({ type: String }) key: string;
  @prop({ type: String }) value: string;
  @prop({ type: Boolean }) active: boolean;
}

export default getModelForClass(ConfigModel);
