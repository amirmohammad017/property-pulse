"use client";

import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";

type PropertyImagesProps = {
  images: string[];
  name: string;
};

export default function PropertyImages({ images, name }: PropertyImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    // All images share one Gallery, so the lightbox lets users swipe through every photo.
    <Gallery>
      <section className="bg-blue-50 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={image}
              className="relative h-64 md:h-96 rounded-xl overflow-hidden"
            >
              <Item
                original={image}
                thumbnail={image}
                width={1000}
                height={600}
              >
                {({ ref, open }) => (
                  <Image
                    ref={ref}
                    onClick={open}
                    src={image}
                    alt={`${name}, photo ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover cursor-zoom-in"
                  />
                )}
              </Item>
            </div>
          ))}
        </div>
      </section>
    </Gallery>
  );
}
