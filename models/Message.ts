import { Schema, model, models, Model, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  property: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  body?: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender id is required."],
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient id is required."],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property id is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
    },
    phone: String,
    body: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Message =
  (models.Message as Model<IMessage>) ||
  model<IMessage>("Message", MessageSchema);

export default Message;
