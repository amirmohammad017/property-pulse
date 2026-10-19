"use server";

import connectDb from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

type CheckBookmarkResult = { bookmark: boolean } | { error: string };

const checkBookmarkStatus = async (
  propertyId: string
): Promise<CheckBookmarkResult> => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return { error: "You need to be signed in to check bookmark status." };
    }

    await connectDb();

    const user = await User.findById(sessionUser.userId);
    if (!user) {
      return { error: "User not found." };
    }

    const bookmark = user.bookmarks.some(
      (id) => id.toString() === propertyId
    );

    return { bookmark };
  } catch (error) {
    console.error("checkBookmarkStatus failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

export default checkBookmarkStatus;
