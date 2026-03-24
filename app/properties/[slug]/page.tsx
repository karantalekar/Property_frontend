import { notFound } from "next/navigation";
import {
  FileText,
  CheckCircle,
  Bed,
  User,
} from "lucide-react";
import { getPropertyDetails, getGalleryImages } from "@/API/property";
import PropertyGallery from "@/component/property/PropertyGallery";
import Image from "next/image";
import BookingCardClient from "@/component/property/BookingCardClient";
import PropertyReviewsSection from "@/component/property/PropertyReviewsSection";

const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

/* =========================
   TYPES
========================= */

interface Amenity {
  id: number;
  name: string;
  image: string;
}

interface IncludedItem {
  id: number;
  name: string;
}

interface ReviewItem {
  id: number;
  customer_name: string;
  date: string;
  rating: number;
  review: string;
}

interface PolicyItem {
  id: number;
  description: string;
}

/* =========================
   PAGE
========================= */

async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [property, galleryImages] = await Promise.all([
    getPropertyDetails({ slug }),
    getGalleryImages({ slug }),
  ]);

  if (!property) notFound();

  const categories = galleryImages?.categories || [];
  const firstCategory = categories[0];
  const firstCategoryData = galleryImages?.[firstCategory] || {
    images: [],
    videos: [],
  };

  const mainImage =
    firstCategoryData.images[0] || property.image_1920 || "/placeholder.jpg";

  return (
    <main className="w-full space-y-4 ">
      <div className="bg-[#9c755b] h-20 w-full"></div>

      <h1 className="text-black md:text-5xl md:ml-20 text-2xl ml-5 mt-2">
        {property.name}
      </h1>
      <p className="text-black md:text-2xl md:ml-20 ml-5 text-sm">
        {property.address}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-20">
        <div className="col-span-1 lg:col-span-12 space-y-6">
          <PropertyGallery
            categories={categories}
            galleryImages={galleryImages}
            BASE_URL={BASE_URL}
          />
        </div>

        <div className="col-span-1 lg:col-span-8 space-y-8 sm:space-y-10 md:space-y-12">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-4 text-base sm:text-lg text-gray-700 md:text-xl underline">
            <span className="flex items-center gap-1 hover:text-[#8b6a55]">
              <Bed size={20} />
              {property?.no_of_rooms} Beds
            </span>
            <span className="flex items-center hover:text-[#8b6a55]">
              <User size={20} />
              {property?.no_of_guest} Guests
            </span>
          </div>

          <section className="space-y-4 sm:space-y-6">
            {property.description ? (
              property.description
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-black leading-relaxed text-base sm:text-lg md:text-xl lg:text-xl"
                  >
                    {paragraph}
                  </p>
                ))
            ) : (
              <p className="text-gray-600">
                Detailed information not available.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black mb-4 sm:mb-5 md:mb-6 ">
              Room Amenities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
              {property.amenities?.map((amenity: Amenity) => (
                <div
                  key={amenity.id}
                  className="p-4 sm:p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 bg-gradient-to-r hover:border-amber-100 font-bold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-stone-100 hover:to-red-100 transition-all duration-300"
                >
                  <img
                    src={`${BASE_URL}${amenity.image}`}
                    alt={amenity.name}
                    className="w-12 sm:w-14 md:w-15 h-12 sm:h-14 md:h-15 object-contain flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base md:text-2xl text-gray-700 font-medium">
                    {amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black mb-3 sm:mb-4 ">
              What's included in this suite?
            </h2>

            <ul className="space-y-2 sm:space-y-3">
              {property.whats_include?.map((item: IncludedItem) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-2xl lg:text-xl text-black"
                >
                  <CheckCircle
                    size={18}
                    className="text-[#8b6a55] flex-shrink-0"
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="col-span-1 lg:col-span-4 space-y-6 sm:space-y-7 md:space-y-8 lg:sticky lg:top-24">
          <BookingCardClient
            property={{
              id: property.id,
              company_id: 10,
              list_price: property.list_price,
              night_count: property.night_count,
              no_of_guest: property.no_of_guest,
              name: property.name,
            }}
            slug={slug}
          />

          <div className="bg-[#f8f3ef] p-4 sm:p-5 md:p-6 rounded-2xl border border-dashed border-[#c9a891]">
            <h3 className="text-xl sm:text-2xl md:text-5xl lg:text-5xl text-black mb-3 sm:mb-4 md:mb-5 ">
              Terms & Policies
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {property?.policies?.map((policy: PolicyItem) => (
                <div key={policy.id} className="flex gap-2 sm:gap-3">
                  <FileText
                    size={20}
                    className="text-[#8b6a55] flex-shrink-0 mt-1"
                  />
                  <p className="text-gray-700 text-sm sm:text-base md:text-xl">
                    {policy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-[#c9a891] h-64 sm:h-72 md:h-80 lg:h-80">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&z=15&output=embed`}
              className="border-0"
              title="Property location"
            />
          </div>
        </aside>
      </div>

      <PropertyReviewsSection
        propertyId={property.id}
        slug={slug}
        companyId={property.company_id}
        initialReviews={property.reviews || []}
      />
    </main>
  );
}

export default PropertyDetailPage;