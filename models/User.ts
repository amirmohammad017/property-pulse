import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
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
    bookmark: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model("User", UserSchema);
export default User;
