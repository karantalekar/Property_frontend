import { getContactData } from "@/API/home";
import ContactSection from "@/component/contact/ContactSection";

export default async function ContactPage() {
  const data = await getContactData();

  const banner = data?.banner;
  const gallery = data?.gallery;

  return (
    <main className="min-h-screen bg-white">
      <ContactSection banner={banner} gallery={gallery} />
    </main>
  );
}
