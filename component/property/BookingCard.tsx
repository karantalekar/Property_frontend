"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Loader,
  ChevronDown,
} from "lucide-react";
import DatePicker from "react-datepicker";
import { getAvailability } from "@/API/property";
import { formatDateForApi } from "@/API/apiCore";
import { getNightCount, syncCheckoutWithCheckin } from "@/hooks/dateHelper";

interface BookingCardProps {
  property: {
    id: number;
    company_id: number;
    list_price: number;
    night_count: number;
    no_of_guest: number;
    name: string;
  };
  slug: string;
  lang?: "en" | "ar";
  onBookingNext?: (bookingData: any) => void;
  initialValues?: {
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
  };
}

interface AvailabilityResponse {
  status?: boolean;
  available?: boolean;
  message?: string;
  price?: number;
  total_price?: number;
  nights?: number;
}

export default function BookingCard({
  property,
  slug,
  lang = "en",
  onBookingNext,
  initialValues,
}: BookingCardProps) {
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    initialValues?.checkIn ? new Date(initialValues.checkIn) : null,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    initialValues?.checkOut ? new Date(initialValues.checkOut) : null,
  );
  const [adults, setAdults] = useState(initialValues?.adults ?? 1);
  const [children, setChildren] = useState(initialValues?.children ?? 0);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const totalGuests = adults + children;
  const maxGuests = property.no_of_guest;

  // ✅ Sync initialValues when they change
  useEffect(() => {
    if (initialValues?.checkIn) {
      setCheckInDate(new Date(initialValues.checkIn));
    }
    if (initialValues?.checkOut) {
      setCheckOutDate(new Date(initialValues.checkOut));
    }
    if (initialValues?.adults !== undefined) {
      setAdults(initialValues.adults);
    }
    if (initialValues?.children !== undefined) {
      setChildren(initialValues.children);
    }
  }, [
    initialValues?.checkIn,
    initialValues?.checkOut,
    initialValues?.adults,
    initialValues?.children,
  ]);

  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
    setCheckOutDate(syncCheckoutWithCheckin(date, checkOutDate));
  };

  const handleAdultsChange = (newAdults: number) => {
    setAdults(newAdults);
    setAvailability(null);
    setError(null);
  };

  const handleChildrenChange = (newChildren: number) => {
    setChildren(newChildren);
    setAvailability(null);
    setError(null);
  };

  const formatDateForAPI = (date: Date | null) => {
    if (!date) return "";
    return formatDateForApi(date);
  };

  const calculatePrice = () => {
    if (!checkInDate || !checkOutDate) return property.list_price;

    const nights = getNightCount(checkInDate, checkOutDate);
    return nights * property.list_price;
  };

  const buildPayload = () => {
    return {
      checkin_date: formatDateForAPI(checkInDate),
      checkout_date: formatDateForAPI(checkOutDate),
      company_id: property.company_id,
      food: false,
      guest: totalGuests,
      lang: "en_US",
      pets: false,
      product_id: String(property.id),
      slug: slug,
    };
  };

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      setError("Please select both check-in and check-out dates");
      return;
    }

    if (checkOutDate < checkInDate) {
      toast.error("Check-out date must be after check-in date");
      setError("Check-out date must be after check-in date");
      return;
    }

    if (totalGuests < 1) {
      toast.error("Please select at least 1 guest");
      setError("Please select at least 1 guest");
      return;
    }

    if (totalGuests > maxGuests) {
      toast.error(`Maximum ${maxGuests} guests allowed`);
      setError(`Maximum ${maxGuests} guests allowed`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = buildPayload();

      console.log("🔍 Checking availability with payload:", payload);

      const response = await getAvailability(
        slug,
        property.company_id,
        payload,
      );

      console.log(" Availability response:", response);

      // const isAvailable = response?.available || response?.status;
      const isAvailable = response?.available === true;

      if (isAvailable) {
        setAvailability(response);
        toast.success(" Property is available for your dates!");
        setError(null);
      } else {
        const errorMessage =
          response?.message || "Property is not available for these dates";
        toast.error(errorMessage);
        setError(errorMessage);
        setAvailability(null);
      }
    } catch (err: any) {
      console.error(" Availability check error:", err);
      const errorMessage = err.message || "Failed to check availability";
      toast.error(errorMessage);
      setError(errorMessage);
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const isAvailable = availability?.available || availability?.status;
    // const isAvailable = response?.available === true;

    if (!isAvailable) {
      toast.error("Please check availability first");
      setError("Please check availability first");
      return;
    }

    const bookingData = {
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalGuests,
      payload: buildPayload(),
      property,
      slug,
      lang,
    };

    console.log("📋 Redirecting to BookingPopup with data:", bookingData);

    // Call the callback to open BookingPopup
    if (onBookingNext) {
      onBookingNext(bookingData);
    } else {
      // Fallback: emit custom event if no callback provided
      window.dispatchEvent(
        new CustomEvent("openBookingPopup", { detail: bookingData }),
      );
    }
  };

  const nights =
    checkInDate && checkOutDate
      ? getNightCount(checkInDate, checkOutDate)
      : property.night_count;
  // Guest drop down options
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        guestRef.current &&
        !guestRef.current.contains(event.target as Node)
      ) {
        setShowGuestDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-[#c9a891] shadow-sm space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <h3 className="text-lg sm:text-xl md:text-3xl text-black">Book Now</h3>
        <div className="text-right">
          <span className="text-base sm:text-lg md:text-xl text-black">
            <span className="font-semibold text-lg sm:text-xl md:text-xl text-black block">
              SAR {property.list_price}
            </span>
            <span className="text-gray-500 text-sm">
              / {property.night_count} night
            </span>
          </span>
        </div>
      </div>

      {/* Check-in Date */}
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
        <Calendar size={20} className="flex-shrink-0" />
        <DatePicker
          selected={checkInDate}
          onChange={handleCheckInChange}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
          placeholderText="Check-in"
          className="bg-transparent w-full  outline-none text-lg md:text-xl sm:text-base"
        />
      </div>

      {/* Check-out Date */}
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
        <Calendar size={20} className="flex-shrink-0" />
        <DatePicker
          selected={checkOutDate}
          onChange={(date: Date | null) => setCheckOutDate(date)}
          minDate={checkInDate || new Date()}
          dateFormat="yyyy-MM-dd"
          placeholderText="Check-out"
          className="bg-transparent w-full outline-none text-lg md:text-xl sm:text-base"
        />
      </div>

      {/* Guests Selection */}
      <div className="relative" ref={guestRef}>
        <button
          type="button"
          onClick={() => setShowGuestDropdown((prev) => !prev)}
          className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Users size={20} className="flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-sm sm:text-base md:text-xl font-medium">
              {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
            </div>
            <div className="text-xs md:text-lg text-gray-500">
              {adults} Adult{adults !== 1 ? "s" : ""} • {children} Child
              {children !== 1 ? "ren" : ""}
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`transition-transform ${showGuestDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {showGuestDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Adults */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm md:text-base font-semibold text-gray-800 md:text-lg">
                  Adults
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAdultsChange(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full 
          hover:bg-gray-100 active:scale-90 transition-all duration-150 
          disabled:opacity-40 disabled:cursor-not-allowed text-black text-bold"
                >
                  −
                </button>

                <span className="text-lg font-semibold text-gray-900 w-6 text-center">
                  {adults}
                </span>

                <button
                  onClick={() =>
                    handleAdultsChange(
                      Math.min(maxGuests - children, adults + 1),
                    )
                  }
                  disabled={adults + children >= maxGuests}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full 
          hover:bg-gray-100 active:scale-90 transition-all duration-150 
          disabled:opacity-40 disabled:cursor-not-allowed text-black text-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm md:text-base font-semibold text-gray-800 md:text-lg">
                  Children
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleChildrenChange(Math.max(0, children - 1))
                  }
                  disabled={children <= 0}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full 
          hover:bg-gray-100 active:scale-90 transition-all duration-150 
          disabled:opacity-40 disabled:cursor-not-allowed text-black text-bold"
                >
                  −
                </button>

                <span className="text-lg font-semibold text-gray-900 w-6 text-center">
                  {children}
                </span>

                <button
                  onClick={() =>
                    handleChildrenChange(
                      Math.min(maxGuests - adults, children + 1),
                    )
                  }
                  disabled={adults + children >= maxGuests}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full 
          hover:bg-gray-100 active:scale-90 transition-all duration-150 
          disabled:opacity-40 disabled:cursor-not-allowed text-black text-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base font-medium text-gray-700">
                  Total Guests
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {totalGuests}/{maxGuests}
                </span>
              </div>

              {totalGuests > maxGuests && (
                <p className="text-xs text-gray-500 mt-2">
                  Exceeds maximum capacity
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle
            size={20}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm sm:text-base text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message - Only show availability confirmation */}
      {success && (
        <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle
            size={20}
            className="text-green-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm sm:text-base text-green-700">{success}</p>
        </div>
      )}

      {/* Main CTA Button - Check Availability or Next */}
      <button
        onClick={
          availability?.available || availability?.status
            ? handleNext
            : handleCheckAvailability
        }
        disabled={loading || !checkInDate || !checkOutDate}
        className={`w-full text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-medium transition-colors flex items-center justify-center gap-2
    ${availability?.available || availability?.status
            ? "bg-[#8b6a55] hover:bg-[#6f5443]"
            : "bg-[#8b6a55] hover:bg-[#6f5443]"
          }
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            Checking...
          </>
        ) : availability?.available || availability?.status ? (
          <>Next</>
        ) : (
          "Check Availability"
        )}
      </button>
    </div>
  );
}
