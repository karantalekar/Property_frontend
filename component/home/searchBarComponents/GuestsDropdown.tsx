import { useEffect, useRef, useState } from "react";

type GuestsValue = {
  adults: number;
  children: number;
  pets: boolean;
  parking: boolean; // new toggle
};

export default function GuestsDropdown({
  value,
  onChange,
  placeholder,
  t,
  lang,
}: {
  value: GuestsValue;
  onChange: (val: GuestsValue) => void;
  placeholder: string;
  t?: any;
  lang?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const decrement = (field: "adults" | "children") => {
    if (value[field] > 0) onChange({ ...value, [field]: value[field] - 1 });
  };

  const increment = (field: "adults" | "children") => {
    onChange({ ...value, [field]: value[field] + 1 });
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* Dropdown header */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full flex justify-between items-center rounded-md text-sm text-gray-900 transition"
      >
        <span
          className={`${
            !value.adults && !value.children ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {value.adults || value.children
            ? `${value.adults} adults, ${value.children} children`
            : placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06 0L10 10.91l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-10 mt-1 w-max bg-white shadow-lg rounded-lg border border-gray-200 p-4">
          {/* Adults */}
          <div className="flex justify-between items-center text-sm mb-3 gap-1">
            <span className="text-gray-700 font-medium">
              {t?.adults || "Adults"}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => decrement("adults")}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-(--primaryColor) hover:text-white text-gray-700 transition"
              >
                -
              </button>
              <span className="w-6 text-center text-black">{value.adults}</span>
              <button
                onClick={() => increment("adults")}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-(--primaryColor) hover:text-white text-gray-700 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between items-center text-sm mb-3 gap-1">
            <span className="text-gray-700 font-medium">
              {t?.children || "Children"}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => decrement("children")}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-(--primaryColor) hover:text-white text-gray-700 transition"
              >
                -
              </button>
              <span className="w-6 text-center text-black">
                {value.children}
              </span>
              <button
                onClick={() => increment("children")}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-(--primaryColor) hover:text-white text-gray-700 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Pets toggle */}
          <Toggle
            label={t?.travelingWithPets || "Traveling with pets?"}
            value={value.pets}
            onToggle={() => onChange({ ...value, pets: !value.pets })}
            lang={lang}
          />

          {/* Car Parking toggle */}
          {/* <Toggle
            label="Need car parking?"
            value={value.parking}
            onToggle={() => onChange({ ...value, parking: !value.parking })}
          /> */}
        </div>
      )}
    </div>
  );
}

// Reusable Toggle component
function Toggle({
  label,
  value,
  onToggle,
  lang,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  lang?: string;
}) {
  const isRTL = lang === "ar";
  return (
    <div className="flex items-center justify-between mt-2 gap-3">
      <span className="text-gray-700 font-medium text-sm">{label}</span>
      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          value ? "bg-(--primaryColor)" : "bg-gray-300"
        }`}
      >
        <span
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            value
              ? isRTL
                ? "-translate-x-6" // move left in RTL
                : "translate-x-6" // move right in LTR
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
