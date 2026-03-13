"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function City({ cities }: { cities: any[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <section className=" py-15 -mb-10 px-6 lg:px-20">
      {/* Heading */}
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-5xl ml-5 text-gray-900">Trending destinations</h2>
        <div className="flex-1 h-[2px] bg-gray-300"></div>
      </div>

      {/* Cities Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {cities?.map((city) => (
          <div key={city.id} className="group cursor-pointer">
            {/* Image */}
            <div className="relative overflow-hidden ml-5 rounded-2xl">
              <Image
                src={`${baseUrl}${city.image}`}
                alt={city.name}
                width={600}
                height={350}
                className="w-full h-[240px] object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex justify-between items-center  mt-5 mx-5">
              <h3 className="text-2xl font-medium ml-5 text-black">
                {city.name}
              </h3>

              <button className="bg-[#8B6A52] text-white p-3 rounded-full shadow-md hover:bg-[#745640] transition cursor-pointer">
                <ArrowRight size={25} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
