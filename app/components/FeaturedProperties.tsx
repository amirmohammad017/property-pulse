import PropertyCard from "./PropertyCard";
import type { PropertyDataWithId } from "@/models/Property";
const FeaturedProperties = ({
  featured,
}: {
  featured: PropertyDataWithId[];
}) => {
  return (
    <>
      <section className="bg-blue-50 px-4 pt-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property._id} property={property} featured />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProperties;
