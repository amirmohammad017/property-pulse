"use client";

import { useFormStatus } from "react-dom";

const SubmitMessageButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="w-full p-2 bg-blue-500 hover:bg-blue-600 transition font-bold text-lg cursor-pointer rounded-lg"
      >
        {pending ? "Submitting..." : "Submit"}
      </button>
    </>
  );
};

export default SubmitMessageButton;
