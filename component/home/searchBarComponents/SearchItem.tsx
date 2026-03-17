import Image from "next/image";

export default function SearchItem({
  icon,
  title,
  children,
  className,
  onClick
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void
}) {
  return (
    <div
      className={`flex items-center sm:items-center gap-2 sm:gap-2 min-w-[140px] sm:min-w-[170px] relative ${className}`}
    >
      <Image
        src={icon}
        alt={title}
        width={32}
        height={32}
        className="
          h-8 w-8
          sm:h-8 sm:w-8
          xl:h-10 xl:w-10
        "
      />

      <div className="flex flex-col grow">
        <span
          className="
            text-sm
            sm:text-md
            font-medium
            text-gray-900
          "
        >
          {title}
        </span>

        <div className="text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
}

export function SearchItemMobile({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 w-full relative">
      <Image src={icon} alt={title} width={32} height={32} />
      <div className="flex flex-col grow w-full">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <div className="w-full">{children}</div> {/* full width input */}
      </div>
    </div>
  );
}
