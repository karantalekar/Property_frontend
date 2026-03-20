"use client";

import { useState } from "react";
import BookingCard from "@/component/property/BookingCard";
import BookingPopup from "@/component/property/BookingPopup";

interface BookingCardWrapperProps {
  property: {
    id: number;
    company_id: number;
    list_price: number;
    night_count: number;
    no_of_guest: number;
    name: string;
  };
  slug: string;
  initialValues?: {
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
  };
}

interface BookingData {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalGuests: number;
  payload: any;
  property: any;
  slug: string;
  lang: string;
}

export default function BookingCardWrapper({
  property,
  slug,
  initialValues,
}: BookingCardWrapperProps) {
  const [bookingPopupOpen, setBookingPopupOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // ✅ Handle when user clicks "Next" in BookingCard
  const handleBookingNext = (data: BookingData) => {
    console.log("✅ BookingCard passed data to wrapper:", data);
    setBookingData(data);
    setBookingPopupOpen(true);
  };

  // ✅ Close popup
  const handlePopupClose = () => {
    console.log("❌ Popup closed");
    setBookingPopupOpen(false);
    setBookingData(null);
  };

  // ✅ Handle successful booking
  const handleBookingSuccess = () => {
    console.log("🎉 Booking successful!");
    handlePopupClose();
  };

  return (
    <>
      {/* BookingCard with callback */}
      <BookingCard
        property={property}
        slug={slug}
        onBookingNext={handleBookingNext}
        initialValues={initialValues}
      />

      {/* BookingPopup - only renders when bookingData exists */}
      {bookingData && bookingPopupOpen && (
        <BookingPopup
          productId={property.id}
          slug={bookingData.slug}
          companyId={property.company_id}
          propertyName={property.name}
          propertyRooms={1}
          initialCheckIn={
            bookingData.checkInDate ? new Date(bookingData.checkInDate) : null
          }
          initialCheckOut={
            bookingData.checkOutDate ? new Date(bookingData.checkOutDate) : null
          }
          rooms={1}
          guests={{
            adults: bookingData.adults,
            children: bookingData.children,
            pets: false,
            parking: false,
          }}
          food={false}
          onClose={handlePopupClose}
          price={property.list_price}
          nightCount={property.night_count}
        />
      )}
    </>
  );
}
