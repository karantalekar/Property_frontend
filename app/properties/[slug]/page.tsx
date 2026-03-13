import { notFound } from "next/navigation";
import { ImageIcon, Video, Send } from "lucide-react";
import { getPropertyDetails, getGalleryImages } from "@/API/property";
import PropertyGallery from "@/component/property/PropertyGallery";
import {
  Calendar,
  Users,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  Info,
} from "lucide-react";
const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";
// Add these state variables at the top of your component

interface GalleryCategory {
  id: number;
  images: string[];
  videos: string[];
}

interface GalleryData {
  [key: string]: GalleryCategory;
  categories: string[];
}

interface Amenity {
  id: number;
  name: string;
  image: string;
}

export default async function PropertyDetailPage({
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
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 space-y-1 mt-30">
        <h1 className="md:text-5xl text-gray-900 capitalize">
          {property.name}
        </h1>
        <p className="md:text-xl text-gray-500 font-medium capitalize">
          {property.address}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          {/* --- HERO SECTION --- */}
          <section className="space-y-6">
            <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden rounded-3xl group cursor-pointer">
              <img
                src={`${BASE_URL}${mainImage}`}
                alt={property.name || "Property Gallery"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold">Main View</h2>
              </div>
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm flex items-center gap-2">
                <ImageIcon size={16} />
                <span>Click to enlarge</span>
              </div>
            </div>

            {/* --- FULL GALLERY SECTION (Client Component) --- */}
            <PropertyGallery
              categories={categories}
              galleryImages={galleryImages}
              BASE_URL={BASE_URL}
            />

            {/* --- DESCRIPTION --- */}
            <section className="space-y-6">
              {property.description ? (
                property.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-600 leading-relaxed text-lg"
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

            {/* --- AMENITIES --- */}
            <section>
              <h2 className="text-3xl text-black mb-6">Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity: Amenity) => (
                  <div
                    key={amenity.id}
                    className="p-4 bg-white rounded-xl border border-red-100 shadow-sm flex items-center gap-6 bg-gradient-to-r from-white-900 to-white-900  hover:via-yellow hover:to-red-100 transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={`${BASE_URL}${amenity.image}`}
                      alt={amenity.name}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-2xl font-medium text-gray-700">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* --- WHAT'S INCLUDED --- */}
            <section className="space-y-6">
              <h2 className="text-3xl text-black">
                What's included in this suite?
              </h2>
              <ul className="grid grid-cols-1 gap-3">
                {property.whats_include?.map((amenity: any) => (
                  <li
                    key={amenity.id}
                    className="flex items-center gap-3 text-lg text-black"
                  >
                    <span className="w-2 h-2 rounded-full bg-black" />
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </section>

            {/* --- REVIEWS SECTION --- */}
            <section className="mt-10 bg-[#FFFBF1] md:px-12 py-5 px-4 rounded-3xl">
              <h2 className="text-5xl text-black mt-5 text-center">
                Guest Reviews
              </h2>
              <div className="container mx-auto space-y-8 mt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {property.reviews?.map((review: any) => (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-gray-900">
                          {review.customer_name}
                        </h4>
                        <span className="text-sm text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex text-amber-400 mb-3">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <p className="text-gray-600 leading-relaxed italic">
                        {review.review}
                      </p>
                    </div>
                  ))}
                </div>

                {/* --- WRITE YOUR REVIEW FORM --- */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-5xl ml-60 text-black mb-4">
                    Write a Review
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="text-xl font-medium text-gray-700">
                        Review
                      </label>
                      <textarea
                        className="w-full p-4 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-gray-300 text-black"
                        rows={3}
                        placeholder="Share your experience with us..."
                      />
                    </div>{" "}
                    <div>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="text-3xl text-gray-300 hover:text-amber-400 transition"
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-8 py-3 bg-[#A27B5C] text-white rounded-xl font-bold hover:bg-[#432323] transition flex items-center justify-center gap-2"
                    >
                      {/* <Send size={18} /> */}
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </section>
        </div>
        {/* --- SIDEBAR SECTION --- */}
        <aside className="lg:sticky lg:top-24 space-y-8">
          {/* BOOK NOW CARD */}
          <div className="bg-white p-6 rounded-2xl border border-[#c9a891] shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl text-black font-semibold flex items-center gap-2">
                Book Now
              </h3>
              <span className="text-lg text-black">
                From{" "}
                <span className="font-semibold text-[#8b6a55]">
                  SAR {property?.list_price}
                </span>
                <span className="text-gray-500">
                  /{property?.night_count} night
                </span>
              </span>
            </div>

            {/* CHECK-IN */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="bg-[#8b6a55] p-2 rounded-md text-white">
                <Calendar size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-black">Select Check-In</p>
                <input
                  type="date"
                  name="checkIn"
                  className="w-full bg-transparent text-sm font-medium outline-none text-black"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* CHECK-OUT */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="bg-[#8b6a55] p-2 rounded-md text-white">
                <Calendar size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-black">Select Check-Out</p>
                <input
                  type="date"
                  name="checkOut"
                  className="w-full bg-transparent text-sm font-medium outline-none text-black"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* GUESTS */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <div className="bg-[#8b6a55] p-2 rounded-md text-white">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-xs text-black">Guests</p>
                  <p className="text-sm font-medium text-black">
                    {property?.no_of_guest} Adults
                  </p>
                </div>
              </div>
              <span className="text-gray-500">⌄</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-black">
              <span>Available Rooms: {property?.no_of_rooms}</span>
            </div>

            <button className="w-full bg-[#8b6a55] text-white py-3 rounded-lg font-medium hover:bg-[#7a5a46] transition flex items-center justify-center gap-2">
              Check Availability
            </button>
          </div>

          {/* TERMS & POLICIES */}
          <div className="bg-[#f8f3ef] p-6 rounded-2xl border border-dashed border-[#c9a891]">
            <h3 className="text-5xl text-black mb-5 flex items-center gap-2">
              Terms & Policies
            </h3>
            <div className="space-y-4">
              {property?.policies?.map((policy: any) => (
                <div key={policy.id} className="flex gap-3">
                  <div className="bg-white w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                    <FileText size={16} className="text-[#8b6a55]" />
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* GOOGLE MAP */}
          <div className="rounded-xl overflow-hidden shadow-lg border border-[#c9a891]">
            <iframe
              width="100%"
              height="280"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&z=15&output=embed`}
              title="Property Location"
              className="border-0"
            ></iframe>
          </div>
        </aside>
      </div>
    </main>
  );
}
