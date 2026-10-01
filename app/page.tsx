import Link from "next/link";
import { properties } from "@/data/properties";
import Hero from "./components/Hero";
import FeaturedProperties from "./components/FeaturedProperties";
import RecentProperties from "./components/RecentProperties";

export default function HomePage() {
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
