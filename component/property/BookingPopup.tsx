"use client";

import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import FormInput from "../reusable/FormInput";
import PrimaryButton from "../reusable/PrimaryButton";
import { translations } from "@/i18n/translations";
import { createBooking, getAvailability } from "@/API/property";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DatePicker from "react-datepicker";

type BookingFormValues = {
  name: string;
  email: string;
  phone: string;
  document: FileList;
};

interface BookingPopupProps {
  productId: number;
  slug: string;
  companyId: number;
  propertyName?: string; // new
  propertyLocation?: string;
  propertyRooms?: number;
  initialCheckIn: Date | null;
  initialCheckOut: Date | null;
  rooms: number;
  guests: {
    adults: number;
    children: number;
    pets: boolean;
    parking: boolean;
  };
  food: boolean;

  onClose: () => void;
  price?: number;
  nightCount?: number;
}

export default function BookingPopup({
  productId,
  slug,
  companyId,
  propertyName,
  propertyLocation,
  propertyRooms,
  initialCheckIn,
  initialCheckOut,
  rooms,
  guests,
  food,
  onClose,
  price,
  nightCount,
}: BookingPopupProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });
  const [document, setDocument] = useState<{
    filename: string;
    file: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    status: boolean;
    message: string;
    booking_ref?: string;
    total_amount?: number;
  } | null>(null);

  const t = translations["en"];
  const totalGuests = guests.adults + guests.children;
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn || today);
  const [checkOut, setCheckOut] = useState<Date | null>(
    initialCheckOut || tomorrow,
  );
  const [datesChanged, setDatesChanged] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null,
  );

  // Validate that year is current year or greater
  const validateDateYear = (date: Date | null): boolean => {
    if (!date) return true; // Allow null dates
    const selectedYear = date.getFullYear();
    const currentYear = new Date().getFullYear();
    return selectedYear >= currentYear;
  };

  // Handle check-in date change with validation
  const handleCheckInChange = (date: Date | null) => {
    if (date && !validateDateYear(date)) {
      toast.error("Booking dates must be in current year or later");
      return;
    }
    setCheckIn(date);
    setDatesChanged(true);
    setIsAvailable(false);
  };

  // Handle check-out date change with validation
  const handleCheckOutChange = (date: Date | null) => {
    if (date && !validateDateYear(date)) {
      toast.error("Booking dates must be in current year or later");
      return;
    }
    setCheckOut(date);
    setDatesChanged(true);
    setIsAvailable(false);
  };

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

  // derive price per night from backend values
  const pricePerNight =
    nightCount && nightCount > 0 ? (price || 0) / nightCount : 0;

  // calculate new total based on selected nights
  const totalCost = pricePerNight * nights * (rooms || 1);

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDocumentUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setDocument({ filename: file.name, file: base64 });
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = async (data: BookingFormValues) => {
    const payload = {
      product_id: productId,
      company_id: companyId,
      checkin_date: formatDate(checkIn),
      checkout_date: formatDate(checkOut),
      name: data.name,
      email: data.email,
      phone: data.phone,
      guests: totalGuests,
      rooms,
      pets: guests.pets,
      food,
      documents: document ? [document] : [],
    };

    try {
      setLoading(true);
      const response = await createBooking(payload);

      // Save API response in state
      setBookingResult(response.result || response);

      // Show toast only on success
      if (response.result?.status) {
        toast.success(t.bookingConfirmed);
      }
      //  else {
      //   toast.error(response.result?.message || t.bookingFailed);
      // }
    } catch (e) {
      console.error(e);
      toast.error(t.bookingFailed);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) return;

    setCheckingAvailability(true);
    setIsAvailable(false);

    try {
      const payload = {
        product_id: productId.toString(),
        checkin_date: formatDate(checkIn),
        checkout_date: formatDate(checkOut),
        guest: totalGuests,
        pets: guests.pets,
        food,
      };

      const response = await getAvailability(slug, companyId, payload);

      if (response.available) {
        toast.success(response.message || "Room is available");
        setIsAvailable(true);
        setDatesChanged(false);
        setAvailabilityMessage(null);
      } else {
        toast.error(response.message || t.propertyNotAvailable);
        setIsAvailable(false);
        const msg = response.message || t.propertyNotAvailable;
        setAvailabilityMessage(msg);
      }
    } catch (error) {
      console.error(error);
      const msg = "Failed to check availability";
      setIsAvailable(false);
      setAvailabilityMessage(msg);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const isFormDisabled = !isAvailable || checkingAvailability;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn max-h-[80vh]">
        {/* LEFT: Summary */}
        <div className="md:w-1/2 bg-linear-to-b from-[#FFF8EE] to-[#FFF3E0] p-6 md:p-10 flex flex-col justify-between gap-2 md:gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-3xl font-bold text-(--primaryColor)">
              {t.bookingDetails}
            </h3>
            <button
              onClick={onClose}
              className=" md:hidden mt-2 p-2 md:mt-6 self-start text-sm text-(--primaryColor) bg-white rounded-full hover:underline transition"
            >
              <X size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-md md:text-lg font-bold text-black line-clamp-1">
              {propertyName}
            </h2>
            <p className="text-sm text-gray-500">{propertyLocation}</p>
          </div>
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center bg-white/50 p-2 md:p-4 rounded-xl shadow-inner">
              <div>
                <p className="text-lg text-gray-500">{t.guests}</p>
                <p className="text-xl font-bold text-black">{totalGuests}</p>
              </div>
              <div>
                <p className="text-lg text-gray-500">{t.availableRooms}</p>
                <p className="text-xl text-black font-bold">{propertyRooms}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg text-gray-500">{`${t.selectCheckIn}`}</p>
                <DatePicker
                  selected={checkIn}
                  onChange={(date: Date | null) => handleCheckInChange(date)}
                  minDate={today}
                  className=" bg-white/50 p-2 md:p-4 rounded-xl text-black shadow-inner w-[100%]"
                  placeholderText={`${t.selectCheckIn}`}
                />
              </div>
              <div>
                <p className="text-lg text-gray-500">{`${t.selectCheckOut}`}</p>
                <DatePicker
                  selected={checkOut}
                  onChange={(date: Date | null) => handleCheckOutChange(date)}
                  minDate={
                    checkIn
                      ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)
                      : tomorrow
                  }
                  className=" bg-white/50 p-2 md:p-4 text-black rounded-xl shadow-inner w-[100%]"
                  placeholderText={`${t.selectCheckOut}`}
                />
              </div>
            </div>
            <p className="text-2xl text-black font-semibold">
              {t.total}: SAR {totalCost.toFixed(2) || 0} ({nights} {t.nights})
            </p>
          </div>
          <button
            onClick={onClose}
            className=" mt-2 md:mt-6 self-start text-lg text-[#FF6B00] hover:underline transition"
          >
            {t.cancel}
          </button>
        </div>

        {/* RIGHT: Form or Confirmation */}
        <div className="md:w-1/2 p-4 md:p-10 bg-white flex flex-col gap-4 md:gap-6 overflow-y-auto">
          <h3 className="text-lg md:text-3xl font-bold text-(--primaryColor)">
            {t.guestDetails || "Guest Details"}
          </h3>
          {bookingResult ? (
            <div className="text-center space-y-4 h-full flex flex-col items-center justify-center">
              <h3
                className={` text-xl md:text-2xl font-semibold md:font-normal ${
                  bookingResult.status ? "text-green-600" : "text-red-600"
                }`}
              >
                {bookingResult.status ? t.bookingConfirmed : t.bookingFailed}
              </h3>

              <p className="text-gray-700 font-semibold">
                {bookingResult.message}
              </p>

              {bookingResult.status && (
                <>
                  <p className="font-semibold text-black">
                    {t.bookingRef || "Booking Reference"}:{" "}
                    {bookingResult.booking_ref}
                  </p>
                  <p className="font-semibold text-black">
                    {t.totalAmount || "Total Amount"}: SAR
                    {bookingResult.total_amount}
                  </p>
                </>
              )}

              <PrimaryButton onClick={onClose}>
                {t.close || "Close"}
              </PrimaryButton>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="space-y-1 md:space-y-4"
            >
              <fieldset
                disabled={isFormDisabled}
                className={`space-y-4 transition-opacity ${
                  isFormDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <FormInput
                  label={t.fullName}
                  placeholder={t.enterName}
                  registration={register("name", { required: t.nameRequired })}
                  error={errors.name}
                />
                <FormInput
                  label={t.emailAddress}
                  type="email"
                  placeholder="you@example.com"
                  registration={register("email", {
                    required: t.emailRequired,
                    pattern: { value: /^\S+@\S+$/i, message: t.emailInvalid },
                  })}
                  error={errors.email}
                />
                <FormInput
                  label={t.phone}
                  placeholder={t.phonePlaceholder}
                  registration={register("phone", {
                    required: t.phoneRequired,
                    pattern: {
                      value: /^\+?[0-9]+$/,
                      message: t.phoneInvalid,
                    },
                    minLength: {
                      value: 7,
                      message: t.phoneInvalidLen,
                    },
                    maxLength: {
                      value: 15,
                      message: t.phoneInvalidLen,
                    },
                  })}
                  error={errors.phone}
                />

                <label className="flex items-center justify-center my-4 gap-2 cursor-pointer border-2 border-dashed rounded-lg p-2 md:p-4 text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] transition relative">
                  <Upload size={20} />
                  <span className="text-lg">
                    {document?.filename || t.uploadDocument || "Upload ID"}
                  </span>

                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,image/*"
                    {...register("document", {
                      required: t.documentRequired || "Document is required",
                      onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentUpload(file);
                      },
                    })}
                  />
                </label>

                {/* Error message */}
                {errors.document && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.document.message}
                  </p>
                )}
              </fieldset>
              {availabilityMessage && (
                <p className="text-red-500 text-sm mb-2 text-center">
                  {availabilityMessage}
                </p>
              )}
              {!isAvailable ? (
                <PrimaryButton
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability}
                >
                  {t.checkAvailability}
                </PrimaryButton>
              ) : (
                <PrimaryButton type="submit" disabled={loading}>
                  {t.confirmBooking}
                </PrimaryButton>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
