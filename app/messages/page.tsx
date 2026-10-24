import { Types } from "mongoose";
import { FaInbox } from "react-icons/fa";
import MessageCard, { PopulatedMessage } from "../components/MessageCard";
import { getSessionUser } from "@/utils/getSessionUser";
import connectDb from "@/config/database";
import Message from "@/models/Message";
import { IMessage } from "@/models/Message";

type LeanMessage = Omit<IMessage, "sender" | "property"> & {
  _id: Types.ObjectId;
  sender: { _id: Types.ObjectId; username: string };
  property: { _id: Types.ObjectId; name: string };
  createdAt?: Date;
};

// تبدیل ObjectId به رشته قبل از پاس دادن به کامپوننت
const serialize = (m: LeanMessage): PopulatedMessage => ({
  _id: m._id.toString(),
  sender: { _id: m.sender._id.toString(), username: m.sender.username },
  property: { _id: m.property._id.toString(), name: m.property.name },
  name: m.name,
  email: m.email,
  phone: m.phone,
  body: m.body,
  read: m.read,
  createdAt: m.createdAt?.toISOString(),
});

const MessagesPage = async () => {
  //   const messages = mockMessages.map(serialize);
  const session = await getSessionUser();
  if (!session?.userId) {
    throw new Error("User ID is required. Please sign in.");
  }
  await connectDb();
  const readMessages = await Message.find({
    recipient: session.userId,
    read: true,
  })
    .populate("sender", "username")
    .populate("property", "name")
    .sort({ createdAt: -1 })
    .lean();

  const unreadMessages = await Message.find({
    recipient: session.userId,
    read: false,
  })
    .populate("sender", "username")
    .populate("property", "name")
    .sort({ createdAt: -1 })
    .lean();

  const rawMessages = [...readMessages, ...unreadMessages];
  const messages = (rawMessages as unknown as LeanMessage[]).map(serialize);
  const unreadCount = messages.filter((m) => !m.read).length;

  console.log("--------------", readMessages, unreadMessages);
  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        {/* هدر صفحه */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-500">
              Inquiries about your properties
            </p>
          </div>
          <div className="flex gap-3">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
              {messages.length} total
            </span>
            <span className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
              {unreadCount} unread
            </span>
          </div>
        </header>

        {/* لیست یا حالت خالی */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 text-center shadow-sm ring-1 ring-gray-200">
            <FaInbox className="mb-4 text-5xl text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700">
              No messages yet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              When someone contacts you about a property, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {messages.map((m) => (
              <MessageCard key={m._id} message={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MessagesPage;
