"use server";

import connectDb from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

type UnreadMessagesCountResult = { count: number } | { error: string };

const unreadMessagesCount = async (): Promise<UnreadMessagesCountResult> => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return { error: "You need to be signed in to view messages." };
    }

    await connectDb();

    const count = await Message.countDocuments({
      recipient: sessionUser.userId,
      read: false,
    });

    return { count };
  } catch (error) {
    console.error("unreadMessagesCount failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

export default unreadMessagesCount;
