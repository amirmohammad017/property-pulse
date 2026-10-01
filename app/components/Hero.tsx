import Link from "next/link";
import PropertySearchForm from "./PropertySearchForm";

const Hero = () => {
  return (
    <>
      {/* --- Search box */}

      <section className="bg-blue-700 py-20 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Find The Perfect Rental
            </h1>
            <p className="my-4 text-xl text-white">
              Discover the perfect property that suits your needs.
            </p>
          </div>
          <PropertySearchForm />
        </div>
      </section>
      {/* --- section:  propert owners - renters */}

      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* --- Renters */}

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">For Renters</h2>
          <p className="mt-2 mb-4">
            Find your dream rental property. Explore listings and discover the
            right place for you.
          </p>
          <Link
            href="/properties"
            className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Browse Properties
          </Link>
        </div>
        {/* --- Owners */}

        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">For Property Owners</h2>
          <p className="mt-2 mb-4">
            List your properties and reach potential tenants. Rent short term or
            long term.
          </p>
          <Link
            href="/add-property"
            className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Add Property
          </Link>
        </div>
      </section>
    </>
  );
};

export default Hero;
