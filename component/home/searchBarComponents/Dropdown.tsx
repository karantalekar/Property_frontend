import { useEffect, useRef, useState } from "react";

type Option = {
  id: number;
  name: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder: string;
};

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt?.id?.toString() === value);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between cursor-pointer
                   text-sm text-gray-900 group"
      >
        <span
          className={`transition-colors ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selectedOption?.name || placeholder}
        </span>

        <svg
          className={`h-4 w-4 ml-2 text-gray-500
                      transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
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

      {/* Menu */}
      {open && (
        <div
          className="absolute z-10 mt-2 w-full
                     animate-[fadeUp_120ms_ease-out] rounded-md shadow-lg bg-white border border-gray-200 p-4"
        >
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => {
                onChange(opt.id.toString());
                setOpen(false);
              }}
              className="relative px-1 py-2 text-sm cursor-pointer
                         text-gray-700 hover:text-gray-900
                         transition-colors
                         before:absolute before:left-0 before:bottom-0
                         before:h-[2px] before:w-full
                         before:bg-(--primaryColor)
                         before:scale-x-0 hover:before:scale-x-100
                         before:origin-left before:transition-transform"
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
