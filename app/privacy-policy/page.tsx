import { termsAndConditionsApi } from "@/API/home/legalPageApi";
import LegalPageComponent from "@/component/legalPageComponents/LegalPageComponent";
import { LegalPageResult } from "@/types/legalPageTypes";
import { cookies } from "next/headers";

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ar" ? "ar" : "en";

  const response = await termsAndConditionsApi(lang, "Privacy Policy");
  const data = response?.result.data as LegalPageResult;

  return (
    <main className="space-y-0 bg-white">
      <LegalPageComponent data={data} />
    </main>
  );
}
