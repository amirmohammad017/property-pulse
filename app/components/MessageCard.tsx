"use client";
import { FaBuilding, FaClock, FaEnvelope, FaPhone } from "react-icons/fa";
import markMessagesAsRead from "../actions/markMessagesAsRead";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import deleteMessage from "../actions/deleteMessage";

export interface PopulatedMessage {
  _id: string;
  sender: { _id: string; username: string };
  property: { _id: string; name: string };
  name: string;
  email: string;
  phone?: string;
  body?: string;
  read: boolean;
  createdAt?: string;
}

const MessageCard = ({ message }: { message: PopulatedMessage }) => {
  const initial = message.name?.charAt(0).toUpperCase() || "?";
  const date = message.createdAt
    ? new Date(message.createdAt).toLocaleString()
    : "";

  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleReadClick = () => {
    startTransition(async () => {
      const result = await markMessagesAsRead(message._id);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setIsRead(result.read);
      toast.success(
        `Message marked as ${result.read ? "read" : "new"} successfully.`,
      );
    });
  };

  const handleDeleteClick = () => {
    startTransition(async () => {
      await deleteMessage(message._id);
      toast.success("Message deleted successfully.");
      setIsDeleted(true);
    });
  };

  if (isDeleted) {
    return <>deleted message</>;
  }

  return (
    <article
      className={`relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition hover:shadow-md ${
        isRead ? "ring-gray-200" : "ring-blue-200"
      }`}
    >
      {/* نوار رنگی کنار کارت برای پیام‌های جدید */}
      {!isRead && <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />}

      <div className="p-5 pl-6">
        {/* هدر: فرستنده و وضعیت */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-500 text-lg font-bold text-white">
              {initial}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{message.name}</h3>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaClock className="h-3 w-3" />
                {date}
              </p>
            </div>
          </div>

          {!isRead ? (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              New
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              Read
            </span>
          )}
        </header>

        {/* ملک مربوطه */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
          <FaBuilding className="text-gray-400" />
          <span className="text-gray-500">Property:</span>
          <span className="truncate font-medium">{message.property.name}</span>
        </div>

        {/* متن پیام */}
        <p className="mt-4 whitespace-pre-line text-gray-700 leading-relaxed">
          {message.body || (
            <span className="italic text-gray-400">No message body</span>
          )}
        </p>

        {/* اطلاعات تماس */}
        <div className="mt-5 grid gap-2 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
          <a
            href={`mailto:${message.email}`}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <FaEnvelope className="text-gray-400" />
            <span className="truncate">{message.email}</span>
          </a>

          {message.phone && (
            <a
              href={`tel:${message.phone}`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <FaPhone className="text-gray-400" />
              <span>{message.phone}</span>
            </a>
          )}
        </div>

        {/* دکمه‌ها */}
        <footer className="mt-5 flex justify-end gap-2">
          <button
            onClick={handleReadClick}
            disabled={isPending}
            className="rounded-lg border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-600 transition
           hover:bg-blue-50 cursor-pointer
            disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:hover:bg-gray-200"
          >
            {isRead ? "Mark as New" : "Mark as Read"}
          </button>

          <button
            onClick={handleDeleteClick}
            disabled={isPending}
            className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white transition
           hover:bg-red-600 cursor-pointer
             disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
          >
            Delete
          </button>
        </footer>
      </div>
    </article>
  );
};

export default MessageCard;
