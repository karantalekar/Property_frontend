"use client";

import { useEffect, useState } from "react";
import { getPropertyDetails } from "@/API/property";
import PropertyReviewForm from "@/component/property/PropertyReviewForm";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ReviewItem {
    id: number;
    customer_name: string;
    date: string;
    rating: number;
    review: string;
}

interface Props {
    propertyId: number;
    slug: string;
    companyId: number;
    initialReviews: ReviewItem[];
}

export default function PropertyReviewsSection({
    propertyId,
    slug,
    companyId,
    initialReviews,
}: Props) {
    const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setReviews(initialReviews || []);
    }, [initialReviews]);

    const refreshReviews = async () => {
        try {
            setRefreshing(true);
            const property = await getPropertyDetails({ slug });
            setReviews(property?.reviews || []);
        } catch (error) {
            console.error("Failed to refresh reviews:", error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <section className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 bg-[#FFFBF1] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-20 rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-20">
            <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black text-center flex-1">
                    Guest Reviews
                </h2>
            </div>

            {reviews.length > 0 ? (
                <>
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{
                            clickable: true,
                            el: ".custom-pagination", // 👈 custom container
                        }}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-10"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id} className="h-auto">
                                <div className="bg-white h-full min-h-[180px] p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between gap-3 mb-2 sm:mb-3">
                                        <h4 className="font-bold text-black text-sm sm:text-base md:text-xl">
                                            {review.customer_name}
                                        </h4>
                                        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                                            {review.date}
                                        </span>
                                    </div>

                                    <div className="text-amber-400 mb-2 sm:mb-3 text-lg md:text-xl">
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(Math.max(0, 5 - review.rating))}
                                    </div>

                                    <p className="text-gray-600 italic text-sm sm:text-base leading-relaxed">
                                        {review.review}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="custom-pagination mt-6 flex justify-center"></div>
                </>
            ) : (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-500 border border-gray-100 mb-8">
                    No reviews yet. Be the first to share your experience.
                </div>
            )}

            <div className="mt-10">
                <PropertyReviewForm
                    propertyId={propertyId}
                    slug={slug}
                    companyId={companyId}
                    onSuccess={refreshReviews}
                />
            </div>

            {refreshing && (
                <p className="mt-4 text-center text-sm text-gray-500">
                    Refreshing reviews...
                </p>
            )}
        </section>
    );
}