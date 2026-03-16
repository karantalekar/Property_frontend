"use client";

import { addReview } from "@/API/property";
import { RootState } from "@/redux/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface Props {
  propertyId: number;
  slug: string;
  companyId: number;
}

export default function PropertyReviewForm({
  propertyId,
  slug,
  companyId,
}: Props) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const authToken = useSelector((state: RootState) => state.auth.auth_token);

  const handleSubmit = async () => {
    // 🔐 USER NOT LOGGED IN
    if (!authToken) {
      toast.error("Please login to write a review");

      // optional redirect
      setTimeout(() => {
        router.push("/login");
      }, 1200);

      return;
    }

    // ⭐ RATING VALIDATION
    if (!rating) {
      toast.error("Please select rating");
      return;
    }

    setLoading(true);

    try {
      const response = await addReview("en_US", slug, companyId, {
        auth_token: authToken,
        product_id: propertyId,
        rating,
        ...(review && { review }),
      });
console.log("Review API response:", response);
      

      if (response?.status) {
        toast.success("Review submitted successfully");

        setRating(0);
        setReview("");
      } else {
        toast.error(response?.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg md:text-xl text-gray-900 mb-4">
        Write a Review
      </h3>

      <div className="flex flex-col gap-4">
        {/* Stars */}
        <div className="flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "text-amber-400" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          rows={2}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-600 resize-none"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#C2B2A9] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#C2A68C]"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}