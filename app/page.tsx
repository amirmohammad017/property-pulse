import Link from "next/link";
import Hero from "./components/Hero";
import FeaturedProperties from "./components/FeaturedProperties";
import RecentProperties from "./components/RecentProperties";
import connectDb from "@/config/database";
import Property, { PropertyDataWithId } from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";

export default async function HomePage() {
  await connectDb();
  const rawProperties = await Property.find({}).sort({ createdAt: -1 }).lean();
  const properties = rawProperties.map((item) =>
    convertToSerializableObject(item),
  ) as unknown as PropertyDataWithId[];
  const featured = properties
    .filter((property) => property.is_featured)
    .slice(0, 2);
  const recent = properties
    .filter((property) => !property.is_featured)
    .slice(0, 3);

  return (
    <>
      <Hero />
      <FeaturedProperties featured={featured} />
      <RecentProperties recent={recent} />
      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
}
