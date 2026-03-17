"use client";

import SingleBlogCard from "../blogscomponent/SingleBlogCard";
import ContainerSection from "../reusable/ContainerSection";
import Heading2 from "../reusable/Heading2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Button from "../reusable/Button";
import { BlogTypes } from "@/types/home/blogsDataType";
import { Language } from "@/config/locale";
import { translations } from "@/i18n/translations";

interface Props {
  blog: BlogTypes[];
  lang: Language;
}

export default function BlogsSection({ blog, lang }: Props) {
  const t = translations[lang];

  // export default function BlogsSection() {
  // const [blog , setBlogs] = useState<any | null>(null);
  return (
    <ContainerSection>
      <div className="w-full flex justify-between ">
        <Heading2 className="">{t.latestNews}</Heading2>
        <Button
          title={`${t.viewMore}`}
          className="lg:w-60 md:w-40 w-32"
          href="/blogs"
        />
      </div>
      <div className="block lg:hidden mt-8">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          slidesPerView={1}
          spaceBetween={16}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="blog-swiper"
        >
          {blog?.map((blog: any) => (
            <SwiperSlide key={blog.id}>
              <SingleBlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:grid grid-cols-3 gap-8 mt-8">
        {blog?.map((blog: any) => (
          <SingleBlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <style jsx global>
        {`
          .blog-swiper {
            padding-bottom: 40px;
          }
          .blog-swiper .swiper-pagination-bullet {
            background-color: var(--primaryColor);
            opacity: 0.4;
          }

          /* Active dot */
          .blog-swiper .swiper-pagination-bullet-active {
            background-color: var(--primaryColor);
            opacity: 1;
          }
        `}
      </style>
    </ContainerSection>
  );
}
