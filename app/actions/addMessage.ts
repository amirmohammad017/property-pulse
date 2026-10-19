"use server";

import connectDb from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

const addMessage = async (formData: FormData) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("You need to be signed in to send a message");
  }
  await connectDb();
  const recipient = formData.get("recipient");

  if (sessionUser.userId === recipient) {
    throw new Error("You can not message your self.");
  }

  const newMessage = new Message({
    sender: sessionUser.userId,
    recipient,
    property: formData.get("property"),
    body: formData.get("body") || "",
    name: formData.get("names"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
  });
  await newMessage.save();
  return { submitted: true };
};
export default addMessage;
