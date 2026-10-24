"use server";

import connectDb from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteMessage(messageID: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("unAuthorized");
  }

  await connectDb();

  const message = await Message.findById(messageID);
  if (!message) {
    throw new Error("no message found...");
  }
  if (message.recipient.toString() !== sessionUser.userId) {
    throw new Error("you are not allow to delete this message");
  }

  await message.deleteOne();
  revalidatePath("/", "layout");
}

export default deleteMessage;
