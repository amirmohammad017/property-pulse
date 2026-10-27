import { Types } from "mongoose";
import { FaInbox } from "react-icons/fa";
import MessageCard, { PopulatedMessage } from "../components/MessageCard";
import { getSessionUser } from "@/utils/getSessionUser";
import connectDb from "@/config/database";
import Message from "@/models/Message";
import { IMessage } from "@/models/Message";
import Link from "next/link";

type LeanMessage = Omit<IMessage, "sender" | "property"> & {
  _id: Types.ObjectId;
  sender: { _id: Types.ObjectId; username: string };
  property: { _id: Types.ObjectId; name: string };
  createdAt?: Date;
};

type MessagesPageProps = {
  searchParams: Promise<{ filter?: string }>;
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

const MessagesPage = async ({ searchParams }: MessagesPageProps) => {
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

  const { filter } = await searchParams;
  const showUnread = filter === "unread";
  const rawMessages = [...unreadMessages, ...readMessages];
  const messages = (rawMessages as unknown as LeanMessage[]).map(serialize);
  const visibleMessages = showUnread
    ? messages.filter((m) => !m.read)
    : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

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
            <Link
              href="/messages"
              scroll={false}
              className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm ring-1 ring-gray-200 ${
                !showUnread
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {messages.length} total
            </Link>
            <Link
              href="/messages?filter=unread"
              scroll={false}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm ${
                showUnread
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {unreadCount} unread
            </Link>
          </div>
        </header>

        {/* لیست یا حالت خالی */}
        {visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 text-center shadow-sm ring-1 ring-gray-200">
            <FaInbox className="mb-4 text-5xl text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700">
              {showUnread ? "No unread messages" : "No messages yet"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {showUnread
                ? "You're all caught up."
                : "When someone contacts you about a property, it will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {visibleMessages.map((m) => (
              <MessageCard key={m._id} message={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MessagesPage;
