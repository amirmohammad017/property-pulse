import Image from "next/image";
import Link from "next/link";
import { FaBath, FaBed, FaMapMarkerAlt, FaRulerCombined } from "react-icons/fa";
import { propertyImage, type Property } from "@/data/properties";
import { PropertyDataWithId } from "@/models/Property";
export default function PropertyCard({
  property,
  featured = false,
}: {
  property: PropertyDataWithId;
  featured?: boolean;
}) {
  const rate = property?.rates?.monthly
    ? `$${property.rates.monthly.toString()}/mo`
    : property?.rates?.weekly
      ? `$${property.rates.weekly.toString()}/wk`
      : property?.rates?.nightly
        ? `$${property.rates.nightly.toString()}/night`
        : "Ask for rate";

  return (
    <article
      className={`bg-white rounded-xl shadow-md relative overflow-hidden ${featured ? "md:flex" : ""}`}
    >
      <div
        className={`relative h-56 ${featured ? "md:h-auto md:w-2/5 md:shrink-0" : ""}`}
      >
        <Image
          src={propertyImage(property.images[0])}
          alt={property.name}
          fill
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 40vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover"
        />
      </div>
      <div className={`p-5 flex flex-col flex-1 ${featured ? "md:p-6" : ""}`}>
        <div className="mb-5 pr-24">
          <p className="text-gray-600">{property.type}</p>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>
        <p className="absolute top-3 right-3 bg-white px-3 py-2 rounded-lg text-blue-600 font-bold shadow-sm">
          {rate}
        </p>
        <div className="flex justify-center gap-4 text-gray-500 mb-4 text-sm sm:text-base">
          <span>
            <FaBed className="inline mr-1" />
            {property.beds} Beds
          </span>
          <span>
            <FaBath className="inline mr-1" />
            {property.baths} Baths
          </span>
          <span>
            <FaRulerCombined className="inline mr-1" />
            {property.square_feet.toString()} sqft
          </span>
        </div>
        <div className="border-t border-gray-100 pt-4 mt-auto flex flex-col lg:flex-row justify-between lg:items-center gap-3">
          <span className="text-orange-700">
            <FaMapMarkerAlt className="inline mr-2" />
            {property.location?.city}, {property.location?.state}
          </span>
          <Link
            href={`/properties/${property._id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
