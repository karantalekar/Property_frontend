import Image from "next/image";
import ContactForm from "./ContactForm";

interface Props {
  banner: any;
  gallery: any;
}

export default function ContactSection({ banner, gallery }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <>
      {/* Hero Section */}
      <section className="relative  w-full h-[450px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={`${BASE_URL}${banner?.image}`}
          alt={banner?.heading || "Contact Us"}
          fill
          priority
          className="object-cover"
          unoptimized
        />

        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-5xl mb-4">{banner?.heading}</h1>

          <p className="text-lg md:text-xl tracking-wide opacity-90">
            {banner?.description}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full"
          style={{
            backgroundImage: `url('${BASE_URL}${gallery?.image_2}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container mx-auto py-15 px-6 grid md:grid-cols-2 gap-16 relative z-10">
          {/* Left Image */}
          <div className="relative h-[600px] md:h-[1100px] md:w-[100%] w-[100%] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={`${BASE_URL}${gallery?.image}`}
              alt={gallery?.heading}
              fill
              //   className="object-cover"
              unoptimized
            />
          </div>

          {/* Form */}
          <ContactForm gallery={gallery} />
        </div>
      </div>
    </>
  );
}
