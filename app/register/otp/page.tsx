// import RegisterOtpForm from "@/component/auth/RegisterOtpForm";

// // You can use cookies or temporary token for SSR
// export default async function RegisterOtpPage({
//   searchParams,
// }: {
//   searchParams: { email?: string };
// }) {
//   const email = searchParams.email;

//   // You can fetch server-side data here if needed
//   return <RegisterOtpForm email={email} />;
// }

import RegisterOtpForm from "@/component/auth/RegisterOtpForm";

export default async function RegisterOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params?.email;

  return <RegisterOtpForm email={email} />;
}
