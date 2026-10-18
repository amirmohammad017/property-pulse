"use server";

import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

async function bookmarkProperty(propertyID: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required.");
  }

  const user = await User.findById(sessionUser.userId);
  if (!user) {
    throw new Error("user is not found");
  }
  let message = "";
  let isBookmarked = false;

  const bookmarks = user.bookmarks.includes(new Types.ObjectId(propertyID));
  if (bookmarks) {
    user.bookmarks.pull(propertyID);
    isBookmarked = false;
    message = "Bookmark is successfully deleted";
  } else {
    user.bookmarks.push(propertyID);
    isBookmarked = true;
    message = "Bookmark is successfully added.";
  }

  await user.save();
  revalidatePath("/properties/saved", "page");

  return {
    isBookmarked,
    message,
  };
}
export default bookmarkProperty;
