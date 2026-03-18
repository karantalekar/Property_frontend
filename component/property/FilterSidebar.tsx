"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { SlidersHorizontal, Minus, Plus, ChevronDown, X } from "lucide-react";

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

      {/* {open && (
        <div className="px-4 py-4 border-t border-slate-100 space-y-3  bg-white">
          {children}
        </div>
      )} */}
      {open && (
        <div className="px-4 py-4 border-t border-slate-100 bg-white">
          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default function FilterSidebar({
  filters,
  onFilterChange,
  cities = [],
  propertyTypes = [],
  amenities = [],
}: {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  cities?: any[];
  propertyTypes?: any[];
  amenities?: any[];
}) {
  // Get today's date in YYYY-MM-DD format
  // Allow current year and onwards for bookings
  const todayDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  // Min date for check-out should be check-in date or today
  const minCheckOutDate = useMemo(() => {
    return filters.checkIn || todayDate;
  }, [filters.checkIn, todayDate]);

  // Validate that year is current year or greater (not before current year)
  const validateDateYear = (dateString: string): boolean => {
    if (!dateString) return true; // Allow empty dates
    const selectedYear = parseInt(dateString.split("-")[0], 10);
    const currentYear = new Date().getFullYear();
    return selectedYear >= currentYear;
  };

  const update = (partial: Partial<FilterState>) =>
    onFilterChange({ ...filters, ...partial });

  // Handle check-in date change with validation
  const handleCheckInChange = (value: string) => {
    if (value && !validateDateYear(value)) {
      toast.error("Booking dates must be in current year or later");
      return;
    }
    update({ checkIn: value });
  };

  // Handle check-out date change with validation
  const handleCheckOutChange = (value: string) => {
    if (value && !validateDateYear(value)) {
      toast.error("Booking dates must be in current year or later");
      return;
    }
    update({ checkOut: value });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    const defaultValue = defaultFilters[key as keyof FilterState];
    return JSON.stringify(value) !== JSON.stringify(defaultValue);
  });

  return (
    // <div className="h-full bg-fixed bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex flex-col">
    <div className="h-[129vh] mb-40 bg-fixed bg-gradient-to-br  rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex flex-col">
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
            min={todayDate}
            value={filters.checkIn}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
        </FilterSection>

        {/* CHECK-OUT DATE */}
        <FilterSection title="Check-out Date" defaultOpen={false}>
          <input
            type="date"
            min={minCheckOutDate}
            value={filters.checkOut}
            onChange={(e) => handleCheckOutChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
        </FilterSection>

        {/* AMENITIES */}
        {/* <FilterSection title="Amenities" defaultOpen={false}>
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
        </FilterSection> */}
        <FilterSection title="Amenities" defaultOpen={false}>
          <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
            {amenities.length > 0 ? (
              amenities.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors group"
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
