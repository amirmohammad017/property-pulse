import { Schema, model, models, Model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  image?: string;
  bookmarks: Types.Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);
export default User;
