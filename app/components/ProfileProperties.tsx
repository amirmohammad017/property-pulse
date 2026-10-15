"use client";
import { PropertyDataWithId } from "@/models/Property";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProfileProperties = ({
  properties: initialProperties,
}: {
  properties: PropertyDataWithId[];
}) => {
  const [properties] = useState(initialProperties);
  return (
    <>
      {properties.map((p) => (
        <div key={p._id} className="mb-10">
          <Link href={`/properties/${p._id}`}>
            <Image
              className="h-32 w-full rounded-md object-cover"
              src={p.images[0]}
              alt={`${p.name} image`}
              width={1000}
              height={200}
            />
          </Link>
          <div className="mt-2">
            <p className="text-lg font-semibold">{p.name}</p>
            <p className="text-gray-600">
              address: {p.location?.street} {p.location?.city}{" "}
              {p.location?.state}
            </p>
          </div>
          {/* Edit and delete actions */}
          <div className="mt-2">
            <Link
              href={`/properties/edit/${p._id}`}
              className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileProperties;
