// "use client";

// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import {
//   Calendar,
//   Users,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   ChevronDown,
// } from "lucide-react";
// import { getAvailability, createBooking } from "@/API/property"; // Use your existing functions
// interface BookingCardProps {
//   property: {
//     id: number;
//     company_id: number;
//     list_price: number;
//     night_count: number;
//     no_of_guest: number;
//     name: string;
//   };
//   slug: string;
//   lang?: "en" | "ar";
// }

// interface AvailabilityResponse {
//   status?: boolean;
//   available?: boolean;
//   message?: string;
//   price?: number;
//   total_price?: number;
//   nights?: number;
// }

// export default function BookingCard({
//   property,
//   slug,
//   lang = "en",
// }: BookingCardProps) {
//   const [checkInDate, setCheckInDate] = useState("");
//   const [checkOutDate, setCheckOutDate] = useState("");
//   const [adults, setAdults] = useState(1);
//   const [children, setChildren] = useState(0);
//   const [availability, setAvailability] = useState<AvailabilityResponse | null>(
//     null,
//   );
//   const [loading, setLoading] = useState(false);
//   const [bookingLoading, setBookingLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showGuestDropdown, setShowGuestDropdown] = useState(false);

//   // Calculate total guests: adults + children = guests
//   const totalGuests = adults + children;
//   const maxGuests = property.no_of_guest;

//   // Handlers for updating adults/children
//   const handleAdultsChange = (newAdults: number) => {
//     setAdults(newAdults);
//     setAvailability(null);
//     setError(null);
//   };

//   const handleChildrenChange = (newChildren: number) => {
//     setChildren(newChildren);
//     setAvailability(null);
//     setError(null);
//   };

//   // Format date for API (YYYY-MM-DD)
//   const formatDateForAPI = (dateString: string) => dateString;

//   // Calculate price display
//   const calculatePrice = () => {
//     if (!checkInDate || !checkOutDate) return property.list_price;

//     const checkIn = new Date(checkInDate);
//     const checkOut = new Date(checkOutDate);
//     const nights = Math.ceil(
//       (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
//     );

//     return Math.max(nights, 1) * property.list_price;
//   };

//   // ✅ BUILD EXACT PAYLOAD AS REQUIRED
//   const buildPayload = () => {
//     return {
//       checkin_date: formatDateForAPI(checkInDate),
//       checkout_date: formatDateForAPI(checkOutDate),
//       company_id: property.company_id,
//       food: false,
//       guest: totalGuests,
//       lang: "en_US",
//       pets: false,
//       product_id: String(property.id),
//       slug: slug,
//     };
//   };

//   const handleCheckAvailability = async () => {
//     // Validation
//     if (!checkInDate || !checkOutDate) {
//       setError("Please select both check-in and check-out dates");
//       return;
//     }

//     const checkIn = new Date(checkInDate);
//     const checkOut = new Date(checkOutDate);

//     if (checkOut <= checkIn) {
//       setError("Check-out date must be after check-in date");
//       return;
//     }

//     if (totalGuests < 1) {
//       setError("Please select at least 1 guest");
//       return;
//     }

//     if (totalGuests > maxGuests) {
//       setError(`Maximum ${maxGuests} guests allowed`);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const payload = buildPayload();

//       console.log("🔍 Checking availability with payload:", payload);

//       // Use your existing getAvailability function
//       const response = await getAvailability(
//         lang as any,
//         slug,
//         property.company_id,
//         payload,
//       );

//       console.log("✅ Availability response:", response);

//       // Check both 'available' and 'status' fields for compatibility
//       const isAvailable = response?.available || response?.status;

//       if (isAvailable) {
//         setAvailability(response);
//         toast.success(" Property is available for your dates!");
//         setError(null);
//       } else {
//         toast.error(
//           response?.message || "Property is not available for these dates",
//         );
//         setAvailability(null);
//       }
//     } catch (err: any) {
//       console.error("❌ Availability check error:", err);
//       setError(
//         err.message || "Failed to check availability. Please try again.",
//       );
//       setAvailability(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookNow = async () => {
//     if (!availability?.available && !availability?.status) {
//       setError("Please check availability first");
//       return;
//     }

//     setBookingLoading(true);
//     setError(null);

//     try {
//       const payload = buildPayload();

//       console.log("📝 Creating booking with payload:", payload);

//       // Use your existing createBooking function
//       const response = await createBooking(lang as any, payload);

//       console.log("✅ Booking created:", response);

//       // Reset form
//       setCheckInDate("");
//       setCheckOutDate("");
//       setAdults(1);
//       setChildren(0);
//       setAvailability(null);
//     } catch (err: any) {
//       console.error("❌ Booking error:", err);
//       setError(err.message || "Failed to create booking. Please try again.");
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   const nights =
//     checkInDate && checkOutDate
//       ? Math.max(
//           Math.ceil(
//             (new Date(checkOutDate).getTime() -
//               new Date(checkInDate).getTime()) /
//               (1000 * 60 * 60 * 24),
//           ),
//           1,
//         )
//       : property.night_count;

//   return (
//     <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-[#c9a891] shadow-sm space-y-4 sm:space-y-5">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//         <h3 className="text-lg sm:text-xl md:text-3xl text-black">Book Now</h3>
//         <div className="text-right">
//           <span className="text-base sm:text-lg md:text-xl text-black">
//             <span className="font-semibold text-lg sm:text-xl md:text-xl text-black block">
//               SAR {calculatePrice().toFixed(2)}
//             </span>
//             <span className="text-gray-500 text-sm">
//               /{nights} night{nights > 1 ? "s" : ""}
//             </span>
//           </span>
//         </div>
//       </div>

//       {/* Check-in Date */}
//       <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
//         <Calendar size={20} className="flex-shrink-0" />
//         <input
//           type="date"
//           value={checkInDate}
//           onChange={(e) => {
//             setCheckInDate(e.target.value);
//             setAvailability(null);
//             setError(null);
//           }}
//           className="bg-transparent w-full outline-none text-sm sm:text-base"
//           placeholder="Check-in"
//         />
//       </div>

//       {/* Check-out Date */}
//       <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
//         <Calendar size={20} className="flex-shrink-0" />
//         <input
//           type="date"
//           value={checkOutDate}
//           onChange={(e) => {
//             setCheckOutDate(e.target.value);
//             setAvailability(null);
//             setError(null);
//           }}
//           className="bg-transparent w-full outline-none text-sm sm:text-base"
//           placeholder="Check-out"
//         />
//       </div>

//       {/* Guests Selection */}
//       <div className="relative">
//         <button
//           onClick={() => setShowGuestDropdown(!showGuestDropdown)}
//           className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <Users size={20} className="flex-shrink-0" />
//           <div className="flex-1 text-left">
//             <div className="text-sm sm:text-base font-medium">
//               {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
//             </div>
//             <div className="text-xs text-gray-500">
//               {adults} Adult{adults !== 1 ? "s" : ""} • {children} Child
//               {children !== 1 ? "ren" : ""}
//             </div>
//           </div>
//           <ChevronDown
//             size={18}
//             className={`transition-transform ${showGuestDropdown ? "rotate-180" : ""}`}
//           />
//         </button>

//         {/* Guest Dropdown */}
//         {showGuestDropdown && (
//           <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
//             {/* Adults Selection */}
//             <div className="mb-4 pb-4 border-b border-gray-100">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Adults
//               </label>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => handleAdultsChange(Math.max(1, adults - 1))}
//                   disabled={adults <= 1}
//                   className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   −
//                 </button>
//                 <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
//                   {adults}
//                 </span>
//                 <button
//                   onClick={() =>
//                     handleAdultsChange(
//                       Math.min(maxGuests - children, adults + 1),
//                     )
//                   }
//                   disabled={adults + children >= maxGuests}
//                   className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Children Selection */}
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Children
//               </label>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() =>
//                     handleChildrenChange(Math.max(0, children - 1))
//                   }
//                   disabled={children <= 0}
//                   className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   −
//                 </button>
//                 <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
//                   {children}
//                 </span>
//                 <button
//                   onClick={() =>
//                     handleChildrenChange(
//                       Math.min(maxGuests - adults, children + 1),
//                     )
//                   }
//                   disabled={adults + children >= maxGuests}
//                   className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Total Info */}
//             <div className="pt-4 border-t border-gray-100">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-semibold text-gray-700">
//                   Total:
//                 </span>
//                 <span className="text-lg font-bold text-[#8b6a55]">
//                   {totalGuests}/{maxGuests}
//                 </span>
//               </div>
//               {totalGuests > maxGuests && (
//                 <p className="text-xs text-red-600 mt-2">
//                   ⚠️ Exceeds maximum capacity
//                 </p>
//               )}
//             </div>

//             {/* Close Button */}
//             <button
//               onClick={() => setShowGuestDropdown(false)}
//               className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors"
//             >
//               Done
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
//           <AlertCircle
//             size={20}
//             className="text-red-500 flex-shrink-0 mt-0.5"
//           />
//           <p className="text-sm sm:text-base text-red-700">{error}</p>
//         </div>
//       )}

//       {/* Success Message */}
//       {success && (
//         <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
//           <CheckCircle
//             size={20}
//             className="text-green-500 flex-shrink-0 mt-0.5"
//           />
//           <p className="text-sm sm:text-base text-green-700">{success}</p>
//         </div>
//       )}

//       <button
//         onClick={
//           availability?.available || availability?.status
//             ? handleBookNow
//             : handleCheckAvailability
//         }
//         disabled={loading || bookingLoading || !checkInDate || !checkOutDate}
//         className={`w-full text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-medium transition-colors flex items-center justify-center gap-2
//     ${
//       availability?.available || availability?.status
//         ? "bg-[#8b6a55] hover:bg-[#6f5443]"
//         : "bg-[#8b6a55] hover:bg-[#6f5443]"
//     }
//     disabled:opacity-50 disabled:cursor-not-allowed
//   `}
//       >
//         {loading || bookingLoading ? (
//           <>
//             <Loader size={18} className="animate-spin" />
//             {availability?.available || availability?.status
//               ? "Processing..."
//               : "Checking..."}
//           </>
//         ) : availability?.available || availability?.status ? (
//           "Next"
//         ) : (
//           "Check Availability"
//         )}
//       </button>
//     </div>
//   );
// }

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
import { syncCheckoutWithCheckin } from "@/hooks/dateHelper";

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

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Math.max(nights, 1) * property.list_price;
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

    if (checkOutDate <= checkInDate) {
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

      console.log("✅ Availability response:", response);

      const isAvailable = response?.available || response?.status;

      if (isAvailable) {
        setAvailability(response);
        toast.success("✨ Property is available for your dates!");
        setError(null);
      } else {
        const errorMessage =
          response?.message || "Property is not available for these dates";
        toast.error(errorMessage);
        setError(errorMessage);
        setAvailability(null);
      }
    } catch (err: any) {
      console.error("❌ Availability check error:", err);
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
      ? Math.max(
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
          1,
        )
      : property.night_count;
  // Guest drop down options
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
              /{property.night_count} night{nights > 1 ? "s" : ""}
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
      <div className="relative">
        <button
          onClick={() => setShowGuestDropdown(!showGuestDropdown)}
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

        {/* Guest Dropdown */}
        {/* {showGuestDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2 md:text-lg">
                Adults
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAdultsChange(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-8 h-8 flex items-center text-black justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center ">
                  {adults}
                </span>
                <button
                  onClick={() =>
                    handleAdultsChange(
                      Math.min(maxGuests - children, adults + 1),
                    )
                  }
                  disabled={adults + children >= maxGuests}
                  className="w-8 h-8 flex items-center text-black justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 md:text-lg">
                Children
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleChildrenChange(Math.max(0, children - 1))
                  }
                  disabled={children <= 0}
                  className="w-8 h-8 flex items-center justify-center text-black border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                  {children}
                </span>
                <button
                  onClick={() =>
                    handleChildrenChange(
                      Math.min(maxGuests - adults, children + 1),
                    )
                  }
                  disabled={adults + children >= maxGuests}
                  className="w-8 h-8 flex items-center justify-center border text-black border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 md:text-lg">
                  Total:
                </span>
                <span className="text-lg font-bold text-[#8b6a55]">
                  {totalGuests}/{maxGuests}
                </span>
              </div>
              {totalGuests > maxGuests && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Exceeds maximum capacity
                </p>
              )}
            </div>

            <button
              onClick={() => setShowGuestDropdown(false)}
              className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        )} */}
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
    ${
      availability?.available || availability?.status
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
