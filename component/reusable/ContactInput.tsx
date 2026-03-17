import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface ContactInputProps {
  placeholder: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  textarea?: boolean;
  rows?: number;
}

export default function ContactInput({
  placeholder,
  type = "text",
  registration,
  error,
  textarea = false,
  rows = 4,
}: ContactInputProps) {
  const baseClasses =
    "w-full border border-[#B88B6A] px-5 py-4 text-md text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]";

  return (
    <div className="space-y-1">
      {textarea ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={baseClasses}
          {...registration}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={baseClasses}
          {...registration}
        />
      )}

      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
