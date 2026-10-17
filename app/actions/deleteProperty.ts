"use server";

import connectDb from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import s3 from "@/config/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

function getKeyFromUrl(url: string) {
  const publicUrl = process.env.ARVAN_CLOUD_S3_PUBLIC_URL;
  if (!publicUrl) throw new Error("ARVAN_CLOUD_S3_PUBLIC_URL is not set");
  return url.replace(`${publicUrl}/`, "");
}

async function deleteImagesFromS3(imageUrls: string[]) {
  if (imageUrls.length === 0) return;

  const bucket = process.env.ARVAN_CLOUD_S3_BUCKET;
  if (!bucket) throw new Error("ARVAN_CLOUD_S3_BUCKET is not set");

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: imageUrls.map((url) => ({ Key: getKeyFromUrl(url) })),
        Quiet: true,
      },
    }),
  );
}

async function deleteProperty(propertyID: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("unAuthorized");
  }

  await connectDb();

  const property = await Property.findById(propertyID);
  if (!property) {
    throw new Error("no property found...");
  }
  if (property.owner.toString() !== sessionUser.userId) {
    throw new Error("you are not allow to delete this property");
  }

  const imagesURL = property.images;
  await property.deleteOne();
  await deleteImagesFromS3(imagesURL);
  revalidatePath("/", "layout");
}

export default deleteProperty;
