"use server";

import connectDb from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

type markMessagesTypes = { read: boolean } | { error: string };

const markMessagesAsRead = async (
  messageId: string,
): Promise<markMessagesTypes> => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return { error: "You need to be signed in to update messages." };
    }

    await connectDb();

    const message = await Message.findById(messageId);
    if (!message) {
      return { error: "Message not found." };
    }

    if (message.recipient.toString() !== sessionUser.userId) {
      return { error: "Unauthorized." };
    }

    message.read = !message.read;
    await message.save();
    revalidatePath("/messages", "page");

    return { read: message.read };
  } catch (error) {
    console.error("markMessagesAsRead failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

export default markMessagesAsRead;
