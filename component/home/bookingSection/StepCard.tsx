// components/booking/StepCard.tsx
import Image from "next/image";

interface StepCardProps {
  title: string;
  description: string;
  icon: string;
  altText: string;
  offsetClass?: string; // e.g. '-translate-y-6' or 'translate-y-6'
}

export function StepCard({
  title,
  description,
  icon,
  altText,
  offsetClass = "",
}: StepCardProps) {
  return (
    <div
      className={`flex flex-col items-center text-center w-full lg:max-w-[150px] xl:max-w-[220px] px-3 ${offsetClass} transition-transform duration-300 `}
    >
      <div className="h-24 w-24 xl:w-30 xl:h-30 rounded-full bg-white shadow-xl flex items-center justify-center border-[0.5px] border-(--primaryColor)">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${icon}`}
          alt={altText || title || "Step Icon"}
          width={66}
          height={66}
        />
      </div>

      <h3 className="mt-3 text-lg lg:text-xl font-medium text-black lg:w-[200px]">
        {title}
      </h3>
      <p className="sm:mt-2 lg:text-lg sm:text-lg text-md font-light text-gray-800 max-w-[250px] lg:w-[220px]">
        {description}
      </p>
    </div>
  );
}
