"use client";

import { PropertyDataWithId } from "@/models/Property";
import { useSession } from "next-auth/react";
import { FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import bookmarkProperty from "../actions/bookmarkProperty";

const BookmarkButton = ({ property }: { property: PropertyDataWithId }) => {
  const { data: session } = useSession();

  const handleClick = async () => {
    if (!session?.user?.id) {
      return toast.error("You need to be signed in to bookmark a listing.");
    }

    try {
      const res = await bookmarkProperty(property._id);

      if ("error" in res) {
        return toast.error(res.error);
      }
      toast.success(res.message);
      
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      >
        <FaBookmark className="mr-2" /> Bookmark Property
      </button>
    </>
  );
};

export default BookmarkButton;
