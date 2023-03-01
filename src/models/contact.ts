import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ContactModel {
  @prop({ type: String, required: true }) phone: string;
  @prop({ type: Boolean }) valid: boolean;
  @prop({ type: Object }) info: object;
  @prop({ type: String }) bookId: string;
}

export default getModelForClass(ContactModel);
