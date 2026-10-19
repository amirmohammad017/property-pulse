"use server";

import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

type BookmarkResult =
  | { error: string }
  | { message: string; isBookmarked: boolean };

async function bookmarkProperty(propertyId: string): Promise<BookmarkResult> {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return { error: "You need to be signed in to bookmark a listing." };
    }

    const user = await User.findById(sessionUser.userId);
    if (!user) {
      return { error: "User not found." };
    }

    const alreadyBookmarked = user.bookmarks.some(
      (id) => id.toString() === propertyId,
    );

    await User.updateOne(
      { _id: user._id },
      alreadyBookmarked
        ? { $pull: { bookmarks: propertyId } }
        : { $addToSet: { bookmarks: propertyId } },
    );

    revalidatePath("/properties/saved", "page");

    return {
      isBookmarked: !alreadyBookmarked,
      message: alreadyBookmarked
        ? "Bookmark removed successfully."
        : "Bookmark added successfully.",
    };
  } catch (error) {
    console.error("bookmarkProperty failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export default bookmarkProperty;
