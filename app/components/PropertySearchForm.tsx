type Props = {
  location?: string;
  propertyType?: string;
};

const types = [
  "Apartment", "Studio", "Condo", "House", "Cabin Or Cottage",
  "Loft", "Room", "Other",
];

export default function PropertySearchForm({ location = "", propertyType = "All" }: Props) {
  return (
    <form action="/properties" className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center gap-4">
      <div className="w-full md:w-3/5">
        <label htmlFor="location" className="sr-only">Location</label>
        <input id="location" name="location" type="search" defaultValue={location}
          placeholder="Enter Location (City, State, Zip, etc.)"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="w-full md:w-2/5">
        <label htmlFor="property-type" className="sr-only">Property Type</label>
        <select id="property-type" name="propertyType" defaultValue={propertyType}
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All</option>
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <button type="submit" className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Search
      </button>
    </form>
  );
}
