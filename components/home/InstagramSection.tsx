import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_PHOTOS } from "@/lib/mock-data";

export function InstagramSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h2 className="font-display text-[2rem] font-bold text-dark">
          <span className="text-primary font-bold">@</span>
          <span className="italic">iconic_fashion</span>
          {" "}On Instagram
        </h2>
        <p className="text-sm text-[#6B7280] mt-2">
          Prohlédněte nejlepší fotky z Instagramu
        </p>
      </div>

      {/* Full-width photo strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {INSTAGRAM_PHOTOS.map((photo) => (
          <Link
            key={photo.id}
            href={photo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square relative overflow-hidden group block"
          >
            <Image
              src={photo.image}
              alt={`Instagram foto ${photo.id}`}
              fill
              className="object-cover group-hover:opacity-80 transition duration-200"
              unoptimized
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
