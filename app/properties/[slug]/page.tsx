import { notFound } from "next/navigation";
import {
  ImageIcon,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Bed,
  User,
} from "lucide-react";
import { getPropertyDetails, getGalleryImages } from "@/API/property";
import PropertyGallery from "@/component/property/PropertyGallery";
import Image from "next/image";
import PropertyReviewForm from "@/component/property/PropertyReviewForm";
import BookingCardClient from "@/component/property/BookingCardClient"; // ✅ Use client component to get search params
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
      {/* HEADER */}
      <h1 className="text-black md:text-5xl md:ml-20 text-2xl ml-5 mt-2">
        {property.name}
      </h1>
      <p className="text-black md:text-2xl md:ml-20 ml-5 text-sm">
        {property.address}
      </p>
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-20">
        {/* GALLERY */}
        <div className="col-span-1 lg:col-span-12 space-y-6">
          <PropertyGallery
            categories={categories}
            galleryImages={galleryImages}
            BASE_URL={BASE_URL}
          />
        </div>

        {/* LEFT SIDE */}
        <div className="col-span-1 lg:col-span-8 space-y-8 sm:space-y-10 md:space-y-12">
          {/* BEDS / GUESTS */}

          <div className="flex items-center gap-4 sm:gap-6 md:gap-4 text-base sm:text-lg text-gray-700 md:text-xl underline">
            <span className="flex items-center gap-1  hover:text-[#8b6a55]">
              {" "}
              <Bed size={20} />
              {property?.no_of_rooms} Beds
            </span>
            <span className="flex items-center   hover:text-[#8b6a55]">
              <User size={20} />
              {property?.no_of_guest} Guests
            </span>
          </div>

          {/* DESCRIPTION */}
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

          {/* AMENITIES */}
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

          {/* WHAT'S INCLUDED */}
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

        {/* RIGHT SIDE */}
        <aside className="col-span-1 lg:col-span-4 space-y-6 sm:space-y-7 md:space-y-8 lg:sticky lg:top-24">
          {/* ✅ BOOKING CARD CLIENT - Extracts search params and passes to component */}
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

          {/* TERMS */}
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

          {/* MAP */}
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

      {/* REVIEWS FULL WIDTH */}
      <section className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 bg-[#FFFBF1] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-20 rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-20">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black text-center mb-8 sm:mb-10 ">
          Guest Reviews
        </h2>

        {/* REVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 lg:mb-14">
          {property.reviews?.map((review: ReviewItem) => (
            <div
              key={review.id}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border"
            >
              <div className="flex justify-between mb-2 sm:mb-3">
                <h4 className="font-bold text-black text-sm sm:text-base md:text-xl">
                  {review.customer_name}
                </h4>
                <span className="text-xs sm:text-sm text-gray-400">
                  {review.date}
                </span>
              </div>

              <div className="text-amber-400 mb-2 sm:mb-3 text-lg md:text-xl">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="text-gray-600 italic text-sm sm:text-base">
                {review.review}
              </p>
            </div>
          ))}
        </div>

        {/* REVIEW SUBMISSION */}
        <PropertyReviewForm
          propertyId={property.id}
          slug={slug}
          companyId={property.company_id}
        />
      </section>
    </main>
  );
}

export default PropertyDetailPage;
