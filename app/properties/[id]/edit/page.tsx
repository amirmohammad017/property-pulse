import PropertyEditForm from "@/app/components/PropertyEditForm";
import connectDB from "@/config/database";
import Property, { PropertyDataWithId } from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { notFound } from "next/navigation";

const PropertyEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  await connectDB();

  const rawProperty = await Property.findById(id).lean();
  if (!rawProperty) {
    notFound();
  }

  const property = convertToSerializableObject(
    rawProperty,
  ) as unknown as PropertyDataWithId;

  if (!property) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  );
};

export default PropertyEditPage;
