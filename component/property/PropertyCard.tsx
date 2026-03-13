import { h3 } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

interface PropertyProps {
  property: any;
}

const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

export default function PropertyCard({ property }: PropertyProps) {
  // ✅ Add null/undefined check to prevent runtime error
  if (!property) {
    return (
      <div className="flex flex-col md:flex-row bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="relative w-full md:w-[350px] h-[240px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Property</h3>
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Get values with fallbacks
  const imageUrl =
    property.image_url || property.image_1920 || "/placeholder.jpg";
  const title = property.title || property.name || "Property";
  const city = property.city_name || property.address || "Location";
  const price = property.price || 0;
  const rating = property.rating || "5.0";
  const rooms = property.rooms || property.bedrooms || 0;
  const guests = property.guests || 1;

  return (
    <Link href={`/property/${property.slug || property.id}`}>
      <div className="flex flex-col md:flex-row bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-6">
        {/* Image Section */}
        <div className="relative w-full md:w-[350px] h-[240px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.jpg";
            }}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span className="text-[#8B735B]">📍</span> {city}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  📤
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  ❤️
                </button>
              </div>
            </div>

            {/* Rating & Icons */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-medium">
                ★ {rating} (6 Reviews)
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  🛏️ {rooms} Rooms
                </span>
                <span className="flex items-center gap-1">
                  👥 {guests} Guests
                </span>
                <span className="flex items-center gap-1">🐾 No Pets</span>
              </div>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 block uppercase">
                Starting From
              </span>
              <div className="text-xl font-bold text-gray-900">
                {price}{" "}
                <span className="text-sm font-normal text-gray-500">
                  SAR / 1 night
                </span>
              </div>
            </div>
            <button className="bg-[#8B735B] hover:bg-[#705d49] text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
