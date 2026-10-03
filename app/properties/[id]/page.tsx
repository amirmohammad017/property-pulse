import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaBath,
  FaBed,
  FaCheck,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTimes,
} from "react-icons/fa";
import { properties, propertyImage } from "@/data/properties";
import connectDb from "@/config/database";
import Property from "@/models/Property";

// Generate a detail page for each property in the local data.
export function generateStaticParams() {
  return properties.map((property) => ({ id: property._id }));
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDb();
  // Read the [id] route parameter and find the matching property.
  const { id } = await params;
  const rawProperties = await Property.findById(id).lean();
  // Show the 404 page when no property matches the URL.
  if (!rawProperties) notFound();

  const property = { ...rawProperties, _id: rawProperties?._id.toString() };

  return (
    <>
      {/* Main image and link back to the property list */}
      <div className="max-w-7xl mx-auto relative h-72 md:h-100">
        <Image
          src={propertyImage(property.images[0])}
          alt={property.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="max-w-7xl mx-auto py-6 px-6">
        <Link
          href="/properties"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Properties
        </Link>
      </div>

      {/* Property details on the left and contact information on the right */}
      <section className="bg-blue-50 py-10 px-6 grow">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[70%_28%] gap-6">
          {/*property details */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">{property.type}</p>
              <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
              <p className="text-orange-700 flex items-start gap-2">
                <FaMapMarkerAlt className="shrink-0 mt-1" />
                {property.location?.street}, {property.location?.city},{" "}
                {property.location?.state} {property.location?.zipcode}
              </p>
              <h2 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
                Rates & Options
              </h2>
              {/* Nightly, weekly, and monthly rates; a dash means no rate is available. */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {(["nightly", "weekly", "monthly"] as const).map((period) => (
                  <div
                    key={period}
                    className="flex justify-center items-center border-b sm:border-b-0 pb-3 sm:pb-0"
                  >
                    <span className="text-gray-500 text-xl font-bold capitalize mr-2">
                      {period}
                    </span>
                    <span className="text-2xl font-bold text-blue-500">
                      {property.rates?.[period] ? (
                        `$${property.rates[period]?.toString()}`
                      ) : (
                        <FaTimes className="text-red-700" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Description & Details */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-lg font-bold mb-6">Description & Details</h2>
              <div className="flex flex-wrap justify-center gap-6 text-blue-500 mb-4 text-xl">
                <span>
                  <FaBed className="inline mr-2" />
                  {property.beds} Beds
                </span>
                <span>
                  <FaBath className="inline mr-2" />
                  {property.baths} Baths
                </span>
                <span>
                  <FaRulerCombined className="inline mr-2" />
                  {property.square_feet.toString()} sqft
                </span>
              </div>
              <p className="text-gray-600">{property.description}</p>
            </div>

            {/* --- Amenities: Render each item in the amenities array. */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-lg font-bold mb-6">Amenities</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <li key={amenity}>
                    <FaCheck className="inline text-green-600 mr-2" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- Contact Property Manager: Contact details are shown here; messaging comes in a later stage. */}
          <aside className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Contact Property Manager
              </h2>
              <p className="font-semibold">{property.seller_info?.name}</p>
              <a
                className="text-blue-600 hover:underline break-all"
                href={`mailto:${property.seller_info?.email}`}
              >
                {property.seller_info?.email}
              </a>
              <p className="mt-2">{property.seller_info?.phone}</p>
              <p className="text-sm text-gray-500 mt-4">
                Messaging and bookmarks are coming in a later stage.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Gallery of all images for this property */}
      <section className="bg-blue-50 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {property.images.map((image, index) => (
            <div
              key={image}
              className="relative h-64 md:h-96 rounded-xl overflow-hidden"
            >
              <Image
                src={propertyImage(image)}
                alt={`${property.name}, photo ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
