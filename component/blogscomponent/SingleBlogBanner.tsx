import Image from "next/image";

interface BlogBannerProps {
  title: string;
  image: string;
  imageAlt: string;
  label: string;
}

export default function BlogBanner({
  title,
  image,
  imageAlt,
  label,
}: BlogBannerProps) {
  return (
    <section className="relative overflow-hidden pb-6">
      <div className="relative pt-6 lg:pt-12 px-4">
        <div className="text-center mb-4 lg:mb-6">
          <span className="inline-block text-purple-600 font-semibold mb-2">
            {label}
          </span>
          <h1 className="font-bold tracking-normal text-3xl md:text-5xl text-center max-w-4xl mx-auto">
            {title}
          </h1>
        </div>
        <div className="rounded-lg overflow-hidden max-w-[90%] md:max-w-[75%] xl:max-w-[65%] mx-auto card-shadow">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
            alt={imageAlt || title}
            width={1200}
            height={500}
            className="w-full h-[200px] md:h-[300px] lg:h-[350px] xl:h-[450px] object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#e0f7fa] -z-1"></div>
        <div
          className="absolute bottom-0 left-0 right-0 top-1/2 bg-white -z-1"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        ></div>
      </div>
    </section>
  );
}
