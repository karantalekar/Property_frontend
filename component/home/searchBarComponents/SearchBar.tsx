// "use client";

// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import SearchItem, { SearchItemMobile } from "./SearchItem";
// import Dropdown from "./Dropdown";
// import GuestsDropdown from "./GuestsDropdown";
// import DatePicker from "react-datepicker";
// import { translations } from "@/i18n/translations";
// import { formatDateForApi } from "@/API/apiCore";
// import { X } from "lucide-react";
// import { syncCheckoutWithCheckin } from "@/hooks/dateHelper";

// // export const formatDate = (date: Date) => {
// //   return date.toISOString().split("T")[0];
// // };
// interface SearchBarProps {
//   cityData: any;
//   propertyData: any;
//   lang: "en" | "ar";
//   isHomepage?: boolean;

//   initialValues?: {
//     city?: string;
//     type?: string;
//     checkIn?: string;
//     checkOut?: string;
//     adults?: number;
//     children?: number;
//     pets?: boolean;
//   };
// }

// export default function SearchBar({
//   cityData,
//   propertyData,
//   lang,
//   isHomepage,
//   initialValues,
// }: SearchBarProps) {
//   const t = translations[lang];
//   const [city, setCity] = useState("");
//   const [guests, setGuests] = useState({
//     adults: 0,
//     children: 0,
//     pets: false,
//     parking: false,
//   });
//   const [type, setType] = useState("");
//   const [cityOptions, setCityOptions] = useState<
//     { id: number; name: string }[]
//   >([]);
//   const [propertyTypeOptions, setPropertyTypeOptions] = useState<
//     { id: number; name: string }[]
//   >([]);

//   const router = useRouter();

//   const [checkIn, setCheckIn] = useState<Date | null>(null);
//   const [checkOut, setCheckOut] = useState<Date | null>(null);
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     // city & type (important)
//     setCity(initialValues?.city ?? "");
//     setType(initialValues?.type ?? "");

//     // dates
//     setCheckIn(initialValues?.checkIn ? new Date(initialValues.checkIn) : null);
//     setCheckOut(
//       initialValues?.checkOut ? new Date(initialValues.checkOut) : null,
//     );

//     // guests
//     setGuests((g) => ({
//       ...g,
//       adults: initialValues?.adults ?? 0,
//       children: initialValues?.children ?? 0,
//       pets: initialValues?.pets ?? false,
//     }));
//   }, [
//     initialValues?.city,
//     initialValues?.type,
//     initialValues?.checkIn,
//     initialValues?.checkOut,
//     initialValues?.adults,
//     initialValues?.children,
//     initialValues?.pets,
//   ]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // setCityOptions(cityData.map((cityObj: any) => cityObj.name));
//         // setPropertyTypeOptions(propertyData.map((propObj: any) => propObj.name));

//         setCityOptions(
//           cityData.map((c: any) => ({
//             id: c.id,
//             name: c.name,
//           })),
//         );

//         setPropertyTypeOptions(
//           propertyData.map((p: any) => ({
//             id: p.id,
//             name: p.name,
//           })),
//         );
//       } catch (error) {
//         console.error("Failed to load dropdown options", error);
//         // setCityOptions(["Jeddah", "Riyadh", "Dubai"]);
//         // setPropertyTypeOptions(["Apartment", "Villa", "Hotel"]);
//       }
//     }
//     fetchData();
//   }, []);

//   const handleSearch = () => {
//     const payload = {
//       city,
//       type,
//       checkIn: checkIn ? formatDateForApi(checkIn) : undefined,
//       checkOut: checkOut ? formatDateForApi(checkOut) : undefined,
//       adults: guests.adults,
//       children: guests.children,
//       pets: guests.pets,
//       guest_count: guests.adults + guests.children,
//     };

//     // remove empty values
//     const params = new URLSearchParams();

//     Object.entries(payload).forEach(([key, value]) => {
//       if (value !== "" && value !== null && value !== undefined) {
//         params.set(key, String(value));
//       }
//     });

//     // ✅ HOMEPAGE → go to property page
//     if (isHomepage) {
//       router.push(`/properties?${params.toString()}`);
//       return;
//     }

//     // ✅ PROPERTY PAGE → only update params
//     router.replace(`${pathname}?${params.toString()}`);
//     setMobileOpen(false);
//   };
//   const handleCheckInChange = (date: Date | null) => {
//     setCheckIn(date);
//     setCheckOut(syncCheckoutWithCheckin(date, checkOut));
//   };
//   return (
//     <>
//       {/* desktop searchbar  */}
//       <div className="relative hidden lg:block xl:container sm:w-full mx-auto z-9 -mt-24 mb-14 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-full shadow-xl px-6 py-4 sm:py-2 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-1 ">
//           <SearchItem
//             icon="/searchIcons/location.png"
//             title={`${t.chooseCity}`}
//           >
//             <Dropdown
//               value={city}
//               onChange={setCity}
//               options={cityOptions}
//               placeholder={`${t.chooseCity}`}
//             />
//           </SearchItem>

//           <Divider />

//           <SearchItem
//             icon="/searchIcons/property.png"
//             title={`${t.propertyType}`}
//           >
//             <Dropdown
//               value={type}
//               onChange={setType}
//               options={propertyTypeOptions}
//               placeholder={`${t.propertyType}`}
//             />
//           </SearchItem>

//           <Divider />

//           <SearchItem icon="/searchIcons/guests.png" title={`${t.noOfGuests}`}>
//             <GuestsDropdown
//               value={guests}
//               onChange={setGuests}
//               placeholder={`${t.selectGuests}`}
//               t={t}
//               lang={lang}
//             />
//           </SearchItem>

//           <Divider />

//           <SearchItem
//             icon="/searchIcons/calendar.png"
//             title={`${t.selectCheckIn}`}
//           >
//             <DatePicker
//               selected={checkIn}
//               onChange={handleCheckInChange}
//               minDate={new Date()}
//               dateFormat="yyyy-MM-dd"
//               placeholderText={`${t.selectCheckIn}`}
//               className="w-full text-sm bg-transparent outline-none text-black"
//             />
//           </SearchItem>

//           <Divider />

//           <SearchItem
//             icon="/searchIcons/calendar.png"
//             title={`${t.selectCheckOut}`}
//           >
//             <DatePicker
//               selected={checkOut}
//               onChange={(date: Date | null) => setCheckOut(date)}
//               minDate={checkIn || new Date()}
//               dateFormat="yyyy-MM-dd"
//               placeholderText={`${t.selectCheckOut}`}
//               className="w-full text-sm bg-transparent outline-none text-black"
//             />
//           </SearchItem>

//           <button
//             onClick={handleSearch}
//             className="shrink-0 self-center sm:h-16 sm:w-16 xl:h-14 xl:w-14 rounded-full flex items-center justify-center hover:brightness-90 transition"
//             style={{ backgroundColor: "var(--primaryColor)" }}
//             aria-label="Search"
//           >
//             <Image
//               src="/searchIcons/search.png"
//               alt="Search"
//               width={32}
//               height={32}
//               className="h-6 w-6"
//             />
//           </button>
//         </div>
//       </div>

//       {/* Mobile compact search bar */}
//       <div className="lg:hidden z-20 bg-transparent px-4 py-2 relative -mt-20 ">
//         <button
//           onClick={() => setMobileOpen(true)}
//           className="w-full flex items-center gap-3 bg-white rounded-full border border-zinc-300 px-4 py-2 text-start shadow-lg"
//         >
//           <div className="flex-1 px-4">
//             <p className="text-sm font-medium text-black truncate">
//               {t.search}
//             </p>
//             <p className="text-xs text-gray-500 truncate">
//               {t.chooseCity}
//               {" · "}
//               {t.propertyType}
//             </p>
//           </div>
//           <div className="flex-shrink-0 h-10 w-10 rounded-full bg-(--primaryColor) flex items-center justify-center">
//             <Image
//               src="/searchIcons/search.png"
//               alt="Search"
//               width={16}
//               height={16}
//             />
//           </div>
//         </button>
//       </div>
//       {mobileOpen && (
//         <div className="fixed inset-0 z-50 flex items-end">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setMobileOpen(false)}
//           />

//           {/* Bottom sheet */}
//           <div
//             className="
//         relative w-full bg-white
//         rounded-t-3xl
//         max-h-[85vh]
//         overflow-y-auto
//         animate-slideUp
//       "
//           >
//             {/* Handle */}
//             {/* <div className="flex justify-center pt-3">
//               <div className="h-1.5 w-12 rounded-full bg-gray-300" />
//             </div> */}

//             {/* Header */}
//             <div className="flex items-center justify-between px-5 py-4 border-b">
//               <h2 className="text-lg font-semibold text-black">{t.search}</h2>
//               <button
//                 onClick={() => setMobileOpen(false)}
//                 className=" bg-white p-2 z- hover:bg-gray-100 border-2 border-(--primaryColor) rounded-full"
//               >
//                 <X size={14} className="text-(--primaryColor)" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="px-4 py-4">
//               <div className="bg-white rounded-xl p-2 flex flex-col gap-4">
//                 <SearchItemMobile
//                   icon="/searchIcons/location.png"
//                   title={t.chooseCity}
//                 >
//                   <Dropdown
//                     value={city}
//                     onChange={setCity}
//                     options={cityOptions}
//                     placeholder={t.chooseCity}
//                   />
//                 </SearchItemMobile>

//                 <SearchItemMobile
//                   icon="/searchIcons/property.png"
//                   title={t.propertyType}
//                 >
//                   <Dropdown
//                     value={type}
//                     onChange={setType}
//                     options={propertyTypeOptions}
//                     placeholder={t.propertyType}
//                   />
//                 </SearchItemMobile>

//                 <SearchItemMobile
//                   icon="/searchIcons/guests.png"
//                   title={t.noOfGuests}
//                 >
//                   <GuestsDropdown
//                     value={guests}
//                     onChange={setGuests}
//                     placeholder={t.selectGuests}
//                     t={t}
//                     lang={lang}
//                   />
//                 </SearchItemMobile>

//                 <SearchItemMobile
//                   icon="/searchIcons/calendar.png"
//                   title={`${t.selectCheckIn}`}
//                 >
//                   <DatePicker
//                     selected={checkIn}
//                     onChange={handleCheckInChange}
//                     minDate={new Date()}
//                     dateFormat="yyyy-MM-dd"
//                     placeholderText={`${t.selectCheckIn}`}
//                     className="w-full text-sm bg-transparent outline-none text-black"
//                   />
//                 </SearchItemMobile>

//                 <SearchItemMobile
//                   icon="/searchIcons/calendar.png"
//                   title={`${t.selectCheckOut}`}
//                 >
//                   <DatePicker
//                     selected={checkOut}
//                     onChange={(date: Date | null) => setCheckOut(date)}
//                     minDate={checkIn || new Date()}
//                     dateFormat="yyyy-MM-dd"
//                     placeholderText={`${t.selectCheckOut}`}
//                     className="w-full text-sm bg-transparent outline-none text-black"
//                   />
//                 </SearchItemMobile>

//                 <div className="sticky bottom-0 bg-white pt-3">
//                   <button
//                     onClick={handleSearch}
//                     className="w-full bg-(--primaryColor) text-white py-3 rounded-full"
//                   >
//                     {t.search}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// function Divider() {
//   return <div className="hidden sm:block w-px h-12 bg-gray-600" />;
// }

"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchItem, { SearchItemMobile } from "./SearchItem";
import Dropdown from "./Dropdown";
import GuestsDropdown from "./GuestsDropdown";
import DatePicker from "react-datepicker";
import { translations } from "@/i18n/translations";
import { formatDateForApi } from "@/API/apiCore";
import { getPropertyTypes } from "@/API/property";
import { getCityData } from "@/API/home";
import { X } from "lucide-react";
import { syncCheckoutWithCheckin } from "@/hooks/dateHelper";

interface SearchBarProps {
  cityData?: any[];
  propertyData?: any[];
  lang: "en" | "ar";
  isHomepage?: boolean;
  initialValues?: {
    city?: string;
    type?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    pets?: boolean;
  };
}

export default function SearchBar({
  cityData,
  propertyData,
  lang,
  isHomepage,
  initialValues,
}: SearchBarProps) {
  const t = translations[lang];
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    pets: false,
    parking: false,
  });
  const [type, setType] = useState("");
  const [cityOptions, setCityOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Initialize form with initial values
  useEffect(() => {
    setCity(initialValues?.city ?? "");
    setType(initialValues?.type ?? "");
    setCheckIn(initialValues?.checkIn ? new Date(initialValues.checkIn) : null);
    setCheckOut(
      initialValues?.checkOut ? new Date(initialValues.checkOut) : null,
    );
    setGuests((g) => ({
      ...g,
      adults: initialValues?.adults ?? 0,
      children: initialValues?.children ?? 0,
      pets: initialValues?.pets ?? false,
    }));
  }, [
    initialValues?.city,
    initialValues?.type,
    initialValues?.checkIn,
    initialValues?.checkOut,
    initialValues?.adults,
    initialValues?.children,
    initialValues?.pets,
  ]);

  // ✅ Fetch and format city and property type data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Use provided data or fetch from API
        let cities = cityData;
        let properties = propertyData;

        if (!cities || cities.length === 0) {
          const cityDataResponse = await getCityData();
          cities = cityDataResponse || [];
        }

        if (!properties || properties.length === 0) {
          const propertyDataResponse = await getPropertyTypes(lang);
          properties = Array.isArray(propertyDataResponse)
            ? propertyDataResponse
            : propertyDataResponse?.data || [];
        }

        // Format and set city options
        const formattedCities = (cities || [])
          .filter((c: any) => c && c.id && c.name)
          .map((c: any) => ({
            id: c.id,
            name: c.name,
          }));

        // Format and set property type options
        const formattedProperties = (properties || [])
          .filter((p: any) => p && p.id && p.name)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
          }));

        console.log("Formatted Cities:", formattedCities);
        console.log("Formatted Properties:", formattedProperties);

        setCityOptions(formattedCities);
        setPropertyTypeOptions(formattedProperties);
      } catch (error) {
        console.error("Failed to load dropdown options", error);
        setCityOptions([]);
        setPropertyTypeOptions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [cityData, propertyData, lang]);

  // ✅ Handle search and navigate
  const handleSearch = () => {
    const payload = {
      city,
      type,
      checkIn: checkIn ? formatDateForApi(checkIn) : undefined,
      checkOut: checkOut ? formatDateForApi(checkOut) : undefined,
      adults: guests.adults,
      children: guests.children,
      pets: guests.pets,
      guest_count: guests.adults + guests.children,
    };

    // Remove empty values
    const params = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });

    // Navigate to properties page or update current page params
    if (isHomepage) {
      router.push(`/properties?${params.toString()}`);
    } else {
      router.replace(`${pathname}?${params.toString()}`);
    }

    setMobileOpen(false);
  };

  // ✅ Handle check-in change and sync check-out
  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    setCheckOut(syncCheckoutWithCheckin(date, checkOut));
  };

  return (
    <>
      {/* Desktop Searchbar */}
      <div className="relative hidden lg:block xl:container sm:w-full mx-auto z-40 -mt-24 mb-14 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-full shadow-xl px-6 py-4 sm:py-2 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-1">
          {/* City Dropdown */}
          <SearchItem
            icon="/searchIcons/location.png"
            title={`${t.chooseCity}`}
          >
            <Dropdown
              value={city}
              onChange={setCity}
              options={cityOptions}
              placeholder={loading ? "Loading cities..." : `${t.chooseCity}`}
            />
          </SearchItem>

          <Divider />

          {/* Property Type Dropdown */}
          <SearchItem
            icon="/searchIcons/property.png"
            title={`${t.propertyType}`}
          >
            <Dropdown
              value={type}
              onChange={setType}
              options={propertyTypeOptions}
              placeholder={loading ? "Loading types..." : `${t.propertyType}`}
            />
          </SearchItem>

          <Divider />

          {/* Guests Dropdown */}
          <SearchItem icon="/searchIcons/guests.png" title={`${t.noOfGuests}`}>
            <GuestsDropdown
              value={guests}
              onChange={setGuests}
              placeholder={`${t.selectGuests}`}
              t={t}
              lang={lang}
            />
          </SearchItem>

          <Divider />

          {/* Check-in Date */}
          <SearchItem
            icon="/searchIcons/calendar.png"
            title={`${t.selectCheckIn}`}
          >
            <DatePicker
              selected={checkIn}
              onChange={handleCheckInChange}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText={`${t.selectCheckIn}`}
              className="w-full text-sm bg-transparent outline-none text-black"
            />
          </SearchItem>

          <Divider />

          {/* Check-out Date */}
          <SearchItem
            icon="/searchIcons/calendar.png"
            title={`${t.selectCheckOut}`}
          >
            <DatePicker
              selected={checkOut}
              onChange={(date: Date | null) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText={`${t.selectCheckOut}`}
              className="w-full text-sm bg-transparent outline-none text-black"
            />
          </SearchItem>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="shrink-0 self-center sm:h-16 sm:w-16 xl:h-14 xl:w-14 rounded-full flex items-center justify-center hover:brightness-90 transition"
            style={{ backgroundColor: "var(--primaryColor)" }}
            aria-label="Search"
          >
            <Image
              src="/searchIcons/search.png"
              alt="Search"
              width={32}
              height={32}
              className="h-6 w-6"
            />
          </button>
        </div>
      </div>

      {/* Mobile Compact Search Bar */}
      <div className="lg:hidden z-20 bg-transparent px-4 py-2 relative -mt-20">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center gap-3 bg-white rounded-full border border-zinc-300 px-4 py-2 text-start shadow-lg"
        >
          <div className="flex-1 px-4">
            <p className="text-sm font-medium text-black truncate">
              {t.search}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {t.chooseCity}
              {" · "}
              {t.propertyType}
            </p>
          </div>
          <div
            className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--primaryColor)" }}
          >
            <Image
              src="/searchIcons/search.png"
              alt="Search"
              width={16}
              height={16}
            />
          </div>
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-black">{t.search}</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="bg-white p-2 hover:bg-gray-100 border-2 rounded-full"
                style={{ borderColor: "var(--primaryColor)" }}
              >
                <X size={14} style={{ color: "var(--primaryColor)" }} />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-4">
              <div className="bg-white rounded-xl p-2 flex flex-col gap-4">
                {/* City Dropdown Mobile */}
                <SearchItemMobile
                  icon="/searchIcons/location.png"
                  title={t.chooseCity}
                >
                  <Dropdown
                    value={city}
                    onChange={setCity}
                    options={cityOptions}
                    placeholder={loading ? "Loading cities..." : t.chooseCity}
                  />
                </SearchItemMobile>

                {/* Property Type Dropdown Mobile */}
                <SearchItemMobile
                  icon="/searchIcons/property.png"
                  title={t.propertyType}
                >
                  <Dropdown
                    value={type}
                    onChange={setType}
                    options={propertyTypeOptions}
                    placeholder={loading ? "Loading types..." : t.propertyType}
                  />
                </SearchItemMobile>

                {/* Guests Dropdown Mobile */}
                <SearchItemMobile
                  icon="/searchIcons/guests.png"
                  title={t.noOfGuests}
                >
                  <GuestsDropdown
                    value={guests}
                    onChange={setGuests}
                    placeholder={t.selectGuests}
                    t={t}
                    lang={lang}
                  />
                </SearchItemMobile>

                {/* Check-in Date Mobile */}
                <SearchItemMobile
                  icon="/searchIcons/calendar.png"
                  title={`${t.selectCheckIn}`}
                >
                  <DatePicker
                    selected={checkIn}
                    onChange={handleCheckInChange}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText={`${t.selectCheckIn}`}
                    className="w-full text-sm bg-transparent outline-none text-black"
                  />
                </SearchItemMobile>

                {/* Check-out Date Mobile */}
                <SearchItemMobile
                  icon="/searchIcons/calendar.png"
                  title={`${t.selectCheckOut}`}
                >
                  <DatePicker
                    selected={checkOut}
                    onChange={(date: Date | null) => setCheckOut(date)}
                    minDate={checkIn || new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText={`${t.selectCheckOut}`}
                    className="w-full text-sm bg-transparent outline-none text-black"
                  />
                </SearchItemMobile>

                {/* Search Button Mobile */}
                <div className="sticky bottom-0 bg-white pt-3">
                  <button
                    onClick={handleSearch}
                    className="w-full text-white py-3 rounded-full transition hover:brightness-90"
                    style={{ backgroundColor: "var(--primaryColor)" }}
                  >
                    {t.search}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Divider() {
  return <div className="hidden sm:block w-px h-12 bg-gray-600" />;
}
