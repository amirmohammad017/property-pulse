"use server";

import connectDb from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3 from "@/config/s3";

export interface PropertyData {
  owner: string;
  type: string;
  name: string;
  description: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates: {
    nightly?: number;
    weekly?: number;
    monthly?: number;
  };
  seller_info: {
    name: string;
    email: string;
    phone?: string;
  };
  images: string[];
}

// Removes files from the bucket. Used to clean up after a failed upload.
// allSettled makes sure one failed delete does not stop the others.
async function deleteUploadedFiles(bucket: string, keys: string[]) {
  await Promise.allSettled(
    keys.map((key) =>
      s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      ),
    ),
  );
}

async function addProperty(formData: FormData) {
  await connectDb();

  // Only authenticated users with a valid DB id can create properties
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User is required!");
  }

  // Fail early if the storage configuration is missing
  const bucket = process.env.ARVAN_CLOUD_S3_BUCKET;
  const publicUrl = process.env.ARVAN_CLOUD_S3_PUBLIC_URL;
  if (!bucket || !publicUrl) {
    throw new Error("Object storage is not configured!");
  }

  // getAll is needed for multi-value fields (checkboxes, multiple files)
  const amenities = formData.getAll("amenities") as string[];

  // Keep only real files; an empty file input sends a File with an empty name
  const images = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File && item.name !== "");

  // Build the data without images first, because the images' storage path
  // depends on the property _id, which exists only after creating the document
  const propertyData: Omit<PropertyData, "images"> = {
    owner: sessionUser.userId,
    type: formData.get("type") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    location: {
      street: formData.get("location.street") as string,
      city: formData.get("location.city") as string,
      state: formData.get("location.state") as string,
      zipcode: formData.get("location.zipcode") as string,
    },
    beds: Number(formData.get("beds")),
    baths: Number(formData.get("baths")),
    square_feet: Number(formData.get("square_feet")),
    amenities,
    rates: {
      // Empty inputs become 0 -> undefined, so they are not stored
      nightly: Number(formData.get("rates.nightly")) || undefined,
      weekly: Number(formData.get("rates.weekly")) || undefined,
      monthly: Number(formData.get("rates.monthly")) || undefined,
    },
    seller_info: {
      name: formData.get("seller_info.name") as string,
      email: formData.get("seller_info.email") as string,
      // Empty phone is stored as undefined instead of an empty string
      phone: (formData.get("seller_info.phone") as string) || undefined,
    },
  };

  // Mongoose generates the _id here, before anything is saved to the database
  const newProperty = new Property(propertyData);
  const propertyId = newProperty._id.toString();

  const imageUrls: string[] = [];
  // Keys of files already uploaded, so they can be removed if something fails
  const uploadedKeys: string[] = [];

  try {
    for (const imageFile of images) {
      // Use only the extension; the original name may contain spaces or
      // non-latin characters that break URLs
      const ext = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // One folder per property, with a unique file name to avoid overwrites
      const key = `properties/${propertyId}/${randomUUID()}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: imageFile.type,
          ACL: "public-read",
        }),
      );

      uploadedKeys.push(key);
      // S3 does not return a URL, so we build it from the public bucket address
      imageUrls.push(`${publicUrl}/${key}`);
    }

    newProperty.images = imageUrls;
    await newProperty.save();
  } catch (error) {
    // Something failed: remove the files that were already uploaded
    await deleteUploadedFiles(bucket, uploadedKeys);
    throw error;
  }

  // Refresh cached pages, then redirect (redirect must stay outside try/catch)
  revalidatePath("/", "layout");
  redirect(`/properties/${propertyId}`);
}

export default addProperty;
