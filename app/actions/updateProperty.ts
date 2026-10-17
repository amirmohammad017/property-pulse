"use server";

import connectDb from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PropertyData } from "./addProperty";

async function updateProperty(propertyID: string, propertyFormData: FormData) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("unAuthorized");
  }

  await connectDb();

  const property = await Property.findByIdAndUpdate(propertyID);
  if (!property) {
    throw new Error("no property found!");
  }

  if (property.owner.toString() != sessionUser.userId) {
    throw new Error("Current user does not own this property");
  }

  const propertyUpdateData: Omit<PropertyData, "images"> = {
    owner: sessionUser.userId,
    type: propertyFormData.get("type") as string,
    name: propertyFormData.get("name") as string,
    description: propertyFormData.get("description") as string,
    location: {
      street: propertyFormData.get("location.street") as string,
      city: propertyFormData.get("location.city") as string,
      state: propertyFormData.get("location.state") as string,
      zipcode: propertyFormData.get("location.zipcode") as string,
    },
    beds: Number(propertyFormData.get("beds")),
    baths: Number(propertyFormData.get("baths")),
    square_feet: Number(propertyFormData.get("square_feet")),
    amenities: propertyFormData.getAll("amenities") as string[],
    rates: {
      // Empty inputs become 0 -> undefined, so they are not stored
      nightly: Number(propertyFormData.get("rates.nightly")) || undefined,
      weekly: Number(propertyFormData.get("rates.weekly")) || undefined,
      monthly: Number(propertyFormData.get("rates.monthly")) || undefined,
    },
    seller_info: {
      name: propertyFormData.get("seller_info.name") as string,
      email: propertyFormData.get("seller_info.email") as string,
      // Empty phone is stored as undefined instead of an empty string
      phone: (propertyFormData.get("seller_info.phone") as string) || undefined,
    },
  };
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyID,
    propertyUpdateData,
  );
  revalidatePath("", "layout");
  redirect(`/properties/${updatedProperty?._id}`);
}
export default updateProperty;
