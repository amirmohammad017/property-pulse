"use client";

import { useEffect } from "react";
import unreadMessagesCount from "../actions/unreadMessagesCount";
import { useGlobalContext } from "../context/GlobalContext";

const UnreadMessageCount = () => {
  const { unreadMessages, setUnreadMessages } = useGlobalContext();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await unreadMessagesCount();
        if (!("error" in res)) setUnreadMessages(res.count);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [setUnreadMessages]);

  if (!unreadMessages) return null;

  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
      {unreadMessages}
    </span>
  );
};

export default UnreadMessageCount;
