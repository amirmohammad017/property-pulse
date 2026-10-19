import PropertyCard from "@/app/components/PropertyCard";
import connectDb from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { PropertyDataWithId } from "@/models/Property";

const SavedPropertiesPage = async () => {
  const session = await getSessionUser();
  if (!session?.userId) {
    throw new Error("You need to be signed in.");
  }
  await connectDb();

  const user = await User.findById(session.userId)
    .populate<{ bookmarks: PropertyDataWithId[] }>("bookmarks")
    .lean();

  const savedProperties = (user?.bookmarks ?? []).filter(Boolean);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-2xl mb-4">Saved Properties</h1>
          {savedProperties?.length === 0 ? (
            <p>No saved properties</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SavedPropertiesPage;
