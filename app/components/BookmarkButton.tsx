"use client";

import { PropertyDataWithId } from "@/models/Property";
import { useSession } from "next-auth/react";
import { FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import bookmarkProperty from "../actions/bookmarkProperty";
import { useEffect, useState } from "react";
import checkBookmarkStatus from "../actions/checkBookmarkStatus";

const BookmarkButton = ({ property }: { property: PropertyDataWithId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const handleClick = async () => {
    if (!session?.user?.id) {
      return toast.error("You need to be signed in to bookmark a listing.");
    }

    try {
      const res = await bookmarkProperty(property._id);

      if ("error" in res) {
        return toast.error(res.error);
      }
      setIsBookmarked(res.isBookmarked);
      toast.success(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    // Not signed in: keep the button disabled
    if (!session?.user?.id) {
      return;
    }

    checkBookmarkStatus(property._id).then((res) => {
      // On error: keep the button disabled
      if ("error" in res) return;

      setIsBookmarked(res.bookmark);
      setLoading(false);
    });
  }, [status, session?.user?.id, property._id]);

  if (loading) {
    return (
      <button
        className="bg-gray-500 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        disabled
      >
        <FaBookmark className="mr-2" /> Sign in to bookmark
      </button>
    );
  }
  return (
    <>
      {isBookmarked ? (
        <button
          onClick={handleClick}
          className="bg-red-500 hover:bg-red-600 text-white cursor-pointer font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        >
          <FaBookmark className="mr-2" /> Remove Bookmark
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        >
          <FaBookmark className="mr-2" /> Bookmark Property
        </button>
      )}
    </>
  );
};

export default BookmarkButton;
