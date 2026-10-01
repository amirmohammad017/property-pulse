import { Property } from "@/data/properties";
import PropertyCard from "./PropertyCard";

const RecentProperties = ({ recent }: { recent: Property[] }) => {
  return (
    <>
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recent.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecentProperties;
