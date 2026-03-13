// "use client";

// import { useEffect, useState } from "react";
// import { SlidersHorizontal, Minus, Plus } from "lucide-react";
// import { getCityData } from "@/API/home";
// import { getAmenities, getPropertyTypes } from "@/API/property";

// export type FilterState = {
//   city: number | null;
//   adults: number;
//   children: number;
//   rooms: number;
//   propertyType: number[];
//   amenities: number[];
//   checkIn: string;
//   checkOut: string;
// };

// export const defaultFilters: FilterState = {
//   city: null,
//   adults: 1,
//   children: 0,
//   rooms: 1,
//   propertyType: [],
//   amenities: [],
//   checkIn: "",
//   checkOut: "",
// };

// const Counter = ({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: number;
//   onChange: (v: number) => void;
// }) => (
//   <div className="flex items-center justify-between py-1.5">
//     <span className="text-lg text-black">{label}</span>

//     <div className="flex items-center gap-3">
//       <button
//         onClick={() => onChange(Math.max(0, value - 1))}
//         className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300"
//       >
//         <Minus className="h-3.5 w-3.5" />
//       </button>

//       <span className="w-5 text-center text-sm font-medium">{value}</span>

//       <button
//         onClick={() => onChange(value + 1)}
//         className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300"
//       >
//         <Plus className="h-3.5 w-3.5" />
//       </button>
//     </div>
//   </div>
// );

// const FilterSection = ({
//   title,
//   children,
//   className = "",
// }: {
//   title: string;
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   const [open, setOpen] = useState(true);

//   return (
//     <div className=" border-black py-3 text-black text-lg">
//       <button
//         className="flex w-full items-center justify-between text-xl font-medium  bg-[#F5EFE6]"
//         onClick={() => setOpen(!open)}
//       >
//         {title}
//         {open ? <Minus size={16} /> : <Plus size={16} />}
//       </button>

//       {open && <div className="mt-2">{children}</div>}
//     </div>
//   );
// };

// // const FilterSection = ({
// //   title,
// //   children,
// // }: {
// //   title: string;
// //   children: React.ReactNode;
// // }) => {
// //   const [open, setOpen] = useState(true);

// //   return (
// //     <div className="border-b border-gray-300 py-3">
// //       <button
// //         className="flex w-full items-center justify-between text-lg font-medium bg-[#F5EFE6] px-2 py-2"
// //         onClick={() => setOpen(!open)}
// //       >
// //         {title}
// //         {open ? <Minus size={16} /> : <Plus size={16} />}
// //       </button>

// //       {open && <div className="mt-2 px-2 text-black">{children}</div>}
// //     </div>
// //   );
// // };

// export default function FilterSidebar({
//   filters,
//   onFilterChange,
// }: {
//   filters: FilterState;
//   onFilterChange: (filters: FilterState) => void;
// }) {
//   const [cities, setCities] = useState<any[]>([]);
//   const [amenities, setAmenities] = useState<any[]>([]);
//   const [propertyTypes, setPropertyTypes] = useState<any[]>([]);

//   const update = (partial: Partial<FilterState>) =>
//     onFilterChange({ ...filters, ...partial });

//   useEffect(() => {
//     async function loadFilters() {
//       const cityData = await getCityData();
//       const amenData = await getAmenities();
//       const typeData = await getPropertyTypes();

//       setCities(cityData || []);
//       setAmenities(amenData?.data || []);
//       setPropertyTypes(typeData?.data || []);
//     }

//     loadFilters();
//   }, []);

//   return (
//     <div className="w-full md:w-80 border rounded-lg p-4 bg-white shadow-sm mt-30  h-320">
//       <div className="flex items-center gap-2 text-white bg-[#3D2B1F] p-2 mb-3 font-semibold">
//         <SlidersHorizontal size={18} />
//         Filter
//       </div>
//       <div className="mt-4">
//         <button
//           onClick={() => onFilterChange(defaultFilters)}
//           className="w-full bg-gray-200 text-black py-2 rounded"
//         >
//           Reset Filters
//         </button>
//       </div>
//       {/* CITY */}
//       <FilterSection title="Choose City">
//         <div className="space-y-2 text-black">
//           {cities.map((city) => (
//             <label key={city.id} className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={filters.city === city.id}
//                 onChange={() => update({ city: city.id })}
//               />
//               {city.name}
//             </label>
//           ))}
//         </div>
//       </FilterSection>

//       {/* PROPERTY TYPE */}
//       <FilterSection title="Property Type">
//         <div className="space-y-2">
//           {propertyTypes.map((type) => (
//             <label key={type.id} className="flex items-center gap-2 text-black">
//               <input
//                 type="checkbox"
//                 checked={filters.propertyType.includes(type.id)}
//                 onChange={() =>
//                   filters.propertyType.includes(type.id)
//                     ? update({
//                         propertyType: filters.propertyType.filter(
//                           (x) => x !== type.id,
//                         ),
//                       })
//                     : update({
//                         propertyType: [...filters.propertyType, type.id],
//                       })
//                 }
//               />
//               {type.name}
//             </label>
//           ))}
//         </div>
//       </FilterSection>

//       {/* GUESTS */}
//       <FilterSection title="Guests">
//         <Counter
//           label="Adults"
//           value={filters.adults}
//           onChange={(v) => update({ adults: v })}
//         />

//         <Counter
//           label="Children"
//           value={filters.children}
//           onChange={(v) => update({ children: v })}
//         />

//         <Counter
//           label="Rooms"
//           value={filters.rooms}
//           onChange={(v) => update({ rooms: v })}
//         />
//       </FilterSection>
//       {/* DATE */}
//       <FilterSection title="Check-in Date">
//         <div className="flex flex-col gap-2 text-black">
//           <input
//             type="date"
//             value={filters.checkIn}
//             onChange={(e) => update({ checkIn: e.target.value })}
//             className="border p-2 rounded"
//           />
//         </div>
//       </FilterSection>
//       <FilterSection title="Check-out Date">
//         <div className="flex flex-col gap-2 text-black">
//           <input
//             type="date"
//             value={filters.checkOut}
//             onChange={(e) => update({ checkOut: e.target.value })}
//             className="border p-2 rounded"
//           />
//         </div>
//       </FilterSection>
//       {/* AMENITIES */}
//       <FilterSection title="Amenities">
//         <div className="space-y-2 text-black">
//           {amenities.map((a) => (
//             <label key={a.id} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={filters.amenities.includes(a.id)}
//                 onChange={() =>
//                   filters.amenities.includes(a.id)
//                     ? update({
//                         amenities: filters.amenities.filter((x) => x !== a.id),
//                       })
//                     : update({
//                         amenities: [...filters.amenities, a.id],
//                       })
//                 }
//               />
//               {a.name}
//             </label>
//           ))}
//         </div>
//       </FilterSection>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Minus, Plus, ChevronDown, X } from "lucide-react";
import { getCityData } from "@/API/home";
import { getAmenities, getPropertyTypes } from "@/API/property";

export type FilterState = {
  city: number | null;
  adults: number;
  children: number;
  rooms: number;
  propertyType: number[];
  amenities: number[];
  checkIn: string;
  checkOut: string;
};

export const defaultFilters: FilterState = {
  city: null,
  adults: 1,
  children: 0,
  rooms: 1,
  propertyType: [],
  amenities: [],
  checkIn: "",
  checkOut: "",
};

const Counter = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between py-2.5 px-3 bg-white rounded-lg  transition-colors">
    <span className="text-lg font-semibold text-slate-700">{label}</span>

    <div className="flex items-center gap-2.5">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50  transition-all text-slate-600 hover:text-slate-900"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="w-8 text-center text-sm font-bold text-slate-900">
        {value}
      </span>

      <button
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-[#FFFBF1] transition-all text-slate-600 hover:text-slate-900"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all duration-300">
      <button
        className="flex w-full items-center justify-between px-4 py-3.5 font-semibold text-slate-900 bg-gradient-to-r bg-[#F5F5F0] transition-all group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-lg bg-[#F5F5F0] font-bold text-black">
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-500 group-hover:text-slate-700 transition-all duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 py-4 border-t border-slate-100 space-y-3  bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default function FilterSidebar({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}) {
  const [cities, setCities] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);

  const update = (partial: Partial<FilterState>) =>
    onFilterChange({ ...filters, ...partial });

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    const defaultValue = defaultFilters[key as keyof FilterState];
    return JSON.stringify(value) !== JSON.stringify(defaultValue);
  });

  useEffect(() => {
    async function loadFilters() {
      const cityData = await getCityData();
      const amenData = await getAmenities();
      const typeData = await getPropertyTypes();

      setCities(cityData || []);
      setAmenities(amenData?.data || []);
      setPropertyTypes(typeData?.data || []);
    }

    loadFilters();
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r bg-[#C2A68C] px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/20 rounded-lg">
            <SlidersHorizontal size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange(defaultFilters)}
            className="px-4 py-2.5 text-xs font-semibold text-white hover:text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-1"
            title="Reset all filters"
          >
            <X size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto space-y-3 p-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* CITY */}
        <FilterSection title="Choose City" defaultOpen={true}>
          <div className="space-y-2">
            {cities.length > 0 ? (
              cities.map((city) => (
                <label
                  key={city.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg  cursor-pointer transition-colors group"
                >
                  <input
                    type="radio"
                    checked={filters.city === city.id}
                    onChange={() => update({ city: city.id })}
                    className="w-4 h-4 accent-[#647FBC] cursor-pointer"
                  />
                  <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">
                    {city.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">Loading cities...</p>
            )}
          </div>
        </FilterSection>

        {/* PROPERTY TYPE */}
        <FilterSection title="Property Type" defaultOpen={true}>
          <div className="space-y-2">
            {propertyTypes.length > 0 ? (
              propertyTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg  cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={filters.propertyType.includes(type.id)}
                    onChange={() =>
                      filters.propertyType.includes(type.id)
                        ? update({
                            propertyType: filters.propertyType.filter(
                              (x) => x !== type.id,
                            ),
                          })
                        : update({
                            propertyType: [...filters.propertyType, type.id],
                          })
                    }
                    className="w-4 h-4 accent-[#647FBC] cursor-pointer rounded"
                  />
                  <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">
                    {type.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">Loading types...</p>
            )}
          </div>
        </FilterSection>

        {/* GUESTS */}
        <FilterSection title="Guests" defaultOpen={true}>
          <div className="space-y-2.5">
            <Counter
              label="Adults"
              value={filters.adults}
              onChange={(v) => update({ adults: v })}
            />
            <Counter
              label="Children"
              value={filters.children}
              onChange={(v) => update({ children: v })}
            />
            <Counter
              label="Rooms"
              value={filters.rooms}
              onChange={(v) => update({ rooms: v })}
            />
          </div>
        </FilterSection>

        {/* CHECK-IN DATE */}
        <FilterSection title="Check-in Date" defaultOpen={false}>
          <input
            type="date"
            value={filters.checkIn}
            onChange={(e) => update({ checkIn: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
        </FilterSection>

        {/* CHECK-OUT DATE */}
        <FilterSection title="Check-out Date" defaultOpen={false}>
          <input
            type="date"
            value={filters.checkOut}
            onChange={(e) => update({ checkOut: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
        </FilterSection>

        {/* AMENITIES */}
        <FilterSection title="Amenities" defaultOpen={false}>
          <div className="space-y-2">
            {amenities.length > 0 ? (
              amenities.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg  cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(a.id)}
                    onChange={() =>
                      filters.amenities.includes(a.id)
                        ? update({
                            amenities: filters.amenities.filter(
                              (x) => x !== a.id,
                            ),
                          })
                        : update({
                            amenities: [...filters.amenities, a.id],
                          })
                    }
                    className="w-4 h-4 accent-[#647FBC] cursor-pointer rounded"
                  />
                  <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">
                    {a.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">
                Loading amenities...
              </p>
            )}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
