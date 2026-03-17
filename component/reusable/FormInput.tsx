"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label: string;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function FormInput({
  label,
  registration,
  error,
  type = "text",
  placeholder,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label className="font-medium text-gray-700">{label}</label>

      <input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...registration}
        className={`w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 transition focus:outline-none focus:border-[var(--primaryColor)] focus:ring-1
    focus:ring-[var(--primaryColor)]
    ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
