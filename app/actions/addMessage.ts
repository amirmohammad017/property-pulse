"use server";

import connectDb from "@/config/database";
import Message, { MessageState } from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

const addMessage = async (
  prevState: MessageState,
  formData: FormData,
): Promise<MessageState> => {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    return { error: "You need to be signed in to send a message" };
  }

  await connectDb();
  const recipient = formData.get("recipient");

  if (sessionUser.userId === recipient) {
    return { error: "You can not message yourself." };
  }

  await new Message({
    sender: sessionUser.userId,
    recipient,
    property: formData.get("property"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    body: formData.get("body") || undefined,
  }).save();

  return { submitted: true };
};

export default addMessage;
