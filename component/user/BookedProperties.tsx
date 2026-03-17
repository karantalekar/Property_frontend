"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { bookingHistory } from "@/API/property";
import toast from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface BookedProperty {
  id?: number;
  ref: string;
  reference?: string;
  property: string;
  property_name?: string;
  property_slug?: string;
  checkin: string;
  check_in_date?: string;
  checkout: string;
  check_out_date?: string;
  amount: number;
  total_price?: number;
  currency?: string;
  state: string;
  status?: string;
  booking_date?: string;
  rejection_reason?: string | boolean;
  address: string;
  location?: string;
  image_url?: string;
  total_guests?: number;
  adults?: number;
  children?: number;
}

export default function BookedProperties() {
  const customerId = useSelector(
    (state: RootState) => state.auth.user?.user_id,
  );
  const authToken = useSelector((state: RootState) => state.auth.auth_token);

  const [bookings, setBookings] = useState<BookedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

  // ✅ Fetch booking history
  useEffect(() => {
    const fetchBookings = async () => {
      if (!customerId || !authToken) {
        setError("Customer information not available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("📋 Fetching bookings for customer:", customerId);

        const response = await bookingHistory("en", customerId);

        console.log("✅ Booking history response:", response);

        if (response?.status || Array.isArray(response)) {
          // Handle both direct array response and wrapped response
          const bookingsData = Array.isArray(response)
            ? response
            : response?.data || response?.bookings || [];
          setBookings(bookingsData);

          if (bookingsData.length === 0) {
            setError(null); // Clear error for empty bookings
          }
        } else {
          setError(response?.message || "No bookings found");
        }
      } catch (err: any) {
        console.error("❌ Fetch bookings error:", err);
        setError(err.message || "Failed to load bookings");
        toast.error("Failed to load your bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [customerId, authToken]);

  // ✅ Get status badge color
  const getStatusStyle = (status: string) => {
    const statusLower = status?.toLowerCase() || "";

    if (statusLower.includes("confirmed") || statusLower.includes("success")) {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
        icon: "text-green-500",
      };
    }

    if (statusLower.includes("pending") || statusLower.includes("waiting")) {
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        badge: "bg-yellow-100 text-yellow-700",
        icon: "text-yellow-500",
      };
    }

    if (statusLower.includes("cancelled") || statusLower.includes("reject")) {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        badge: "bg-red-100 text-red-700",
        icon: "text-red-500",
      };
    }

    return {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      icon: "text-blue-500",
    };
  };

  // ✅ Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ✅ Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      return nights > 0 ? nights : 1;
    } catch {
      return 1;
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 text-center min-h-64">
        <div className="inline-block w-8 h-8 border-4 border-[#9c755b] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4">Loading your bookings...</p>
      </div>
    );
  }

  // ✅ Empty state
  if (bookings.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8 text-gray-500 text-sm sm:text-base text-center min-h-64 flex flex-col items-center justify-center">
        <Calendar className="w-12 h-12 text-gray-300 mb-3" />
        <p className="mb-4">
          {error && error !== "No bookings found"
            ? "Failed to load bookings"
            : "No bookings yet"}
        </p>
        {!error || error === "No bookings found" ? (
          <Link href="/properties/">
            <button className="bg-[#9c755b] text-white px-4 py-2 rounded-lg hover:bg-[#8b6a57] transition-colors text-sm sm:text-base">
              Browse Properties
            </button>
          </Link>
        ) : (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }

  // ✅ Render bookings
  return (
    <div className="border rounded-xl p-3 sm:p-4 md:p-6">
      <h3 className="font-semibold text-black mb-4 sm:mb-6 text-base sm:text-lg md:text-xl">
        My Bookings ({bookings.length} total)
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {bookings.map((booking, index) => {
          const bookingRef = booking.ref || booking.reference;
          const propertyName = booking.property || booking.property_name;
          const checkInDate = booking.checkin || booking.check_in_date;
          const checkOutDate = booking.checkout || booking.check_out_date;
          const bookingAmount = booking.amount || booking.total_price;
          const bookingState = booking.state || booking.status;
          const bookingAddress = booking.address || booking.location;

          const statusStyle = getStatusStyle(bookingState || "");
          const nights = calculateNights(checkInDate || "", checkOutDate || "");

          return (
            <div
              key={booking.id || bookingRef || `booking-${index}`}
              className={`border rounded-xl overflow-hidden transition-all hover:shadow-lg ${statusStyle.border} ${statusStyle.bg}`}
            >
              {/* Header with Reference and Status */}
              <div className="p-3 sm:p-4 border-b flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-xl text-[#9c755b]">
                    Booking Ref: {bookingRef || "N/A"}
                  </h1>
                  <p className=" text-gray-900 text-sm sm:text-base mb-1 truncate">
                    {propertyName || "Property Booking"}
                  </p>
                </div>
                <div
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 ${statusStyle.badge}`}
                >
                  {bookingState?.toLowerCase().includes("confirmed") ||
                  bookingState?.toLowerCase().includes("success") ? (
                    <CheckCircle size={14} />
                  ) : bookingState?.toLowerCase().includes("pending") ? (
                    <Clock size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  {bookingState || "Unknown"}
                </div>
              </div>

              {/* Booking Details */}
              {/* <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <div className="min-w-0">
                      <p className="text-lg text-gray-600 font-medium">
                        Check-in
                      </p>
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {formatDate(checkInDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="min-w-0">
                      <p className="text-lg text-gray-600 font-medium">
                        Check-out
                      </p>
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {formatDate(checkOutDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600 font-medium">
                      Amount:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {typeof bookingAmount === "number" &&
                      !isNaN(bookingAmount)
                        ? bookingAmount.toFixed(2)
                        : bookingAmount || "--"}{" "}
                      <span className="text-sm text-gray-500">
                        {booking.currency || "SAR"}
                      </span>
                    </span>
                  </div>
                </div>

                {bookingAddress && (
                  <div className="flex gap-2">
                    <div className="min-w-0">
                      <p className="text-lg text-gray-600 font-medium">
                        Address
                      </p>
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {bookingAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div> */}
              <div className="w-full border rounded-xl bg-white shadow-sm p-3 sm:p-4 space-y-4">
                {/* Top Row */}
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
                  {/* Check-in */}
                  <div className="min-w-[120px]">
                    <p className="text-sm text-gray-500 font-medium">
                      Check-in
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(checkInDate || "")}
                    </p>
                  </div>

                  {/* Check-out */}
                  <div className="min-w-[120px]">
                    <p className="text-sm text-gray-500 font-medium">
                      Check-out
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(checkOutDate || "")}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="min-w-[120px]">
                    <p className="text-sm text-gray-500 font-medium">Amount</p>
                    <p className="text-base font-bold text-gray-900">
                      {typeof bookingAmount === "number" &&
                      !isNaN(bookingAmount)
                        ? bookingAmount.toFixed(2)
                        : bookingAmount || "--"}{" "}
                      <span className="text-xs text-gray-500">
                        {booking.currency || "SAR"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Address */}
                {bookingAddress && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className="text-sm text-gray-700">{bookingAddress}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
