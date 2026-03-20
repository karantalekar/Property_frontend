"use client";

import { useSearchParams } from "next/navigation";
import BookingCardWrapper from "@/component/property/Bookingcardwrapper ";

interface BookingCardClientProps {
  property: {
    id: number;
    company_id: number;
    list_price: number;
    night_count: number;
    no_of_guest: number;
    name: string;
  };
  slug: string;
}

export default function BookingCardClient({
  property,
  slug,
}: BookingCardClientProps) {
  const params = useSearchParams();

  // Extract filter values from URL search params
  const initialValues = {
    checkIn: params.get("checkIn") || undefined,
    checkOut: params.get("checkOut") || undefined,
    adults: params.get("adults")
      ? parseInt(params.get("adults") as string)
      : undefined,
    children: params.get("children")
      ? parseInt(params.get("children") as string)
      : undefined,
  };

  return (
    <BookingCardWrapper
      property={property}
      slug={slug}
      initialValues={initialValues}
    />
  );
}
