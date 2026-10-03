import Pagination from "../components/Pagination";
import PropertyCard from "../components/PropertyCard";
import PropertySearchForm from "../components/PropertySearchForm";
import connectDb from "@/config/database";
import Property from "@/models/Property";

type SearchParams = Promise<{
  location?: string;
  propertyType?: string;
  page?: string;
}>;
const pageSize = 6;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connectDb();
  const rawProperties = await Property.find({}).lean();
  const properties = rawProperties.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));
  const {
    location = "",
    propertyType = "All",
    page = "1",
  } = await searchParams;
  const query = location.trim().toLowerCase();
  const filtered = properties.filter((property) => {
    const matchesType =
      propertyType === "All" ||
      property.type.toLowerCase() === propertyType.toLowerCase();
    const searchable = [
      property.name ?? "",
      property.description ?? "",
      property.location?.street ?? "",
      property.location?.city ?? "",
      property.location?.state ?? "",
      property.location?.zipcode ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return matchesType && (!query || searchable.includes(query));
  });
  const requestedPage = Number(page);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, Math.max(totalPages, 1))
      : 1;
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return (
    <>
      {/* --- Search box */}
      <div className="max-w-7xl mx-auto bg-blue-700 py-4 px-4">
        <PropertySearchForm location={location} propertyType={propertyType} />
      </div>

      {/* --- List of Properties */}

      <section className="px-4 py-6 grow">
        <div className="max-w-7xl mx-auto py-6">
          <h1 className="text-2xl font-bold mb-4">Browse Properties</h1>

          {visible.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <p>No properties found. Try another location or property type.</p>
          )}

          {/* pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pathname="/properties"
            query={{ location, propertyType }}
          />
        </div>
      </section>
    </>
  );
}
