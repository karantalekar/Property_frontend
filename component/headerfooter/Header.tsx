// "use client";

// import { User, LogOut, Heart, ChevronDown, X, ShieldCheck } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { logoutUser } from "@/redux/slices/authSlice";
// import toast from "react-hot-toast";
// import Link from "next/link";

// export default function Header({
//   header,
//   company,
// }: {
//   header: any[];
//   company: any;
// }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const pathname = usePathname();

//   const user = useSelector((state: RootState) => state.auth.user);
//   const wishlistCount = useSelector(
//     (state: RootState) => state.wishlist.items.length,
//   );

//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const triggerRef = useRef<HTMLButtonElement | null>(null);
//   // ================= CLICK OUTSIDE =================
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node) &&
//         triggerRef.current &&
//         !triggerRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ================= SCROLL =================
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (!header || !company) return null;

//   const leftItems = header.filter(
//     (item: any) =>
//       item.active && item.title !== "Blogs" && item.title !== "Contact Us",
//   );

//   const rightItems = header.filter(
//     (item: any) =>
//       item.active && (item.title === "Blogs" || item.title === "Contact Us"),
//   );

//   const getUserInitials = (name = "") => {
//     if (!name) return "";
//     const parts = name.trim().split(" ");
//     return parts.length > 1
//       ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
//       : parts[0][0].toUpperCase();
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     router.push("/");
//     toast.success("Logged out successfully");
//     setLogoutConfirmOpen(false);
//     setDropdownOpen(false);
//     setMenuOpen(false);
//   };

//   const isActiveRoute = (path: string) => {
//     if (!path) return false;
//     if (pathname === path) return true;
//     if (path !== "/" && pathname.startsWith(path + "/")) return true;
//     return false;
//   };

//   const linkClassName = (path: string) =>
//     `transition ${
//       isActiveRoute(path) ? "text-yellow-400" : "hover:text-yellow-400"
//     }`;

//   return (
//     <>
//       <header
//         className={`w-full fixed top-0 z-50 transition-all duration-300 ${
//           scrolled ? "bg-[#9c755b] shadow-lg" : "bg-transparent"
//         } text-white`}
//       >
//         {/* HEADER */}
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
//           {/* LEFT */}
//           <nav className="hidden md:flex justify-start">
//             <ul className="flex gap-8 text-2xl">
//               {leftItems.map((item: any) => (
//                 <li key={item.id}>
//                   <a href={item.path} className={linkClassName(item.path)}>
//                     {item.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* LOGO */}
//           <div className="flex justify-center">
//             <Link href="/">
//               <img
//                 src={`https://beljumlah-11072023-28562543.dev.odoo.com${company.company_logo}`}
//                 alt={company.company_name}
//                 className="h-14 md:h-16"
//               />
//             </Link>
//           </div>

//           {/* RIGHT */}
//           <nav className="hidden md:flex justify-end relative">
//             <ul className="flex items-center gap-6 text-xl">
//               {/* Static Right Items */}
//               {rightItems.map((item: any) => (
//                 <li key={item.id}>
//                   <a href={item.path} className={linkClassName(item.path)}>
//                     {item.title}
//                   </a>
//                 </li>
//               ))}

//               {/* â¤ï¸ Wishlist */}
//               {user && (
//                 <li>
//                   <button
//                     onClick={() => router.push("/profile?tab=wishlist")}
//                     className="relative hover:text-red-400 transition"
//                   >
//                     <Heart size={28} />
//                     {wishlistCount > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
//                         {wishlistCount}
//                       </span>
//                     )}
//                   </button>
//                 </li>
//               )}

//               {/* AVATAR */}
//               <li className="relative">
//                 {user ? (
//                   <button
//                     ref={triggerRef}
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     className="flex items-center gap-2"
//                     aria-label="Open profile menu"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7a5a46] to-[#a67c5c] flex items-center justify-center font-bold shadow-md ring-2 ring-white/20">
//                       {getUserInitials(user.name)}
//                     </div>
//                     <ChevronDown size={18} className="opacity-90" />
//                   </button>
//                 ) : (
//                   <a href="/login" className="hover:text-yellow-400">
//                     <User size={28} />
//                   </a>
//                 )}

//                 {/* PROFILE DROPDOWN */}
//                 {user && dropdownOpen && (
//                   <div
//                     ref={dropdownRef}
//                     className="absolute right-0 top-14 w-80 rounded-2xl bg-white text-gray-800 shadow-2xl overflow-hidden border border-gray-100"
//                   >
//                     <div className="p-5 bg-gradient-to-r from-[#9c755b] to-[#b68b6f] text-white">
//                       <div className="flex items-center gap-4">
//                         <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-lg font-bold ring-2 ring-white/30">
//                           {getUserInitials(user.name)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm opacity-90">Signed in as</p>
//                           <p className="font-semibold truncate">{user.name}</p>
//                           <p className="text-xs opacity-90 truncate">
//                             {user.email}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="p-2">
//                       <button
//                         onClick={() => {
//                           router.push("/profile");
//                           setDropdownOpen(false);
//                         }}
//                         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-left"
//                       >
//                         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
//                           <User size={18} />
//                         </div>
//                         <div>
//                           <p className="font-medium">Profile</p>
//                         </div>
//                       </button>

//                       <div className="h-px bg-gray-200 my-2" />

//                       <button
//                         onClick={() => setLogoutConfirmOpen(true)}
//                         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-left text-red-600"
//                       >
//                         <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
//                           <LogOut size={18} />
//                         </div>
//                         <div>
//                           <p className="font-medium">Logout</p>
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </li>
//             </ul>
//           </nav>

//           {/* MOBILE MENU BUTTON */}
//           <button
//             className="md:hidden text-3xl"
//             onClick={() => setMenuOpen(true)}
//           >
//             â˜°
//           </button>
//         </div>

//         {/* MOBILE MENU */}
//         <div
//           className={`fixed top-0 right-0 h-full w-[280px] bg-black/90 backdrop-blur-md transform transition-transform duration-300 z-50 ${
//             menuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div className="flex justify-between items-center p-4 border-b border-white/10">
//             <span className="text-lg font-semibold">Menu</span>
//             <button onClick={() => setMenuOpen(false)}>
//               <X size={20} />
//             </button>
//           </div>

//           <ul className="flex flex-col gap-2 px-4 py-5">
//             {header
//               .filter((item: any) => item.active)
//               .map((item: any) => (
//                 <li key={item.id}>
//                   <a
//                     href={item.path}
//                     className={`block px-3 py-3 rounded-xl ${linkClassName(
//                       item.path,
//                     )}`}
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     {item.title}
//                   </a>
//                 </li>
//               ))}

//             {/* â¤ï¸ Mobile Wishlist */}
//             {user && (
//               <li>
//                 <button
//                   onClick={() => {
//                     router.push("/profile?tab=wishlist");
//                     setMenuOpen(false);
//                   }}
//                   className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-left"
//                 >
//                   <Heart size={20} /> Wishlist ({wishlistCount})
//                 </button>
//               </li>
//             )}

//             {user ? (
//               <>
//                 <li>
//                   <button
//                     onClick={() => {
//                       router.push("/profile");
//                       setMenuOpen(false);
//                     }}
//                     className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-left"
//                   >
//                     <User size={20} /> Profile
//                   </button>
//                 </li>

//                 <li>
//                   <button
//                     onClick={() => {
//                       setLogoutConfirmOpen(true);
//                       setMenuOpen(false);
//                     }}
//                     className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-left"
//                   >
//                     <LogOut size={20} /> Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <li>
//                 <a
//                   href="/login"
//                   className="block px-3 py-3 rounded-xl hover:bg-white/10"
//                 >
//                   Login
//                 </a>
//               </li>
//             )}
//           </ul>
//         </div>

//         {/* OVERLAY */}
//         {menuOpen && (
//           <div
//             className="fixed inset-0 bg-black/40 z-40"
//             onClick={() => setMenuOpen(false)}
//           />
//         )}
//       </header>

//       {/* LOGOUT CONFIRM MODAL */}
//       {logoutConfirmOpen && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setLogoutConfirmOpen(false)}
//           />
//           <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
//             <div className="p-6">
//               <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
//                 <ShieldCheck className="text-red-500" size={24} />
//               </div>

//               <h3 className="text-xl font-semibold text-gray-900">
//                 Confirm logout
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 Are you sure you want to log out from your account?
//               </p>

//               <div className="mt-6 flex gap-3">
//                 <button
//                   onClick={() => setLogoutConfirmOpen(false)}
//                   className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// ===============================================================

"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import { User, Heart, ChevronDown, X, LogOut, ShieldCheck } from "lucide-react";

export default function Header({
  header,
  company,
}: {
  header: any[];
  company: any;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.items.length,
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= SCROLL =================
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!header || !company) return null;

  const leftItems = header.filter(
    (item: any) =>
      item.active && item.title !== "Blogs" && item.title !== "Contact Us",
  );
  const rightItems = header.filter(
    (item: any) =>
      item.active && (item.title === "Blogs" || item.title === "Contact Us"),
  );

  const getUserInitials = (name = "") => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
    toast.success("Logged out successfully");
    setLogoutConfirmOpen(false);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    if (!path || !pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isWishlistActive = () => pathname === "/profile" && tab === "wishlist";

  const linkClassName = (path: string) => {
    if (path === "/profile?tab=wishlist")
      return isWishlistActive()
        ? "transition text-red-500"
        : "transition hover:text-red-400";
    return `transition ${
      isActiveRoute(path) ? "text-yellow-400" : "hover:text-yellow-400"
    }`;
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#9c755b] shadow-lg" : "bg-transparent"
        } text-white`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* LEFT */}
          <nav className="hidden md:flex justify-start">
            <ul className="flex gap-8 text-2xl">
              {leftItems.map((item: any) => (
                <li key={item.id}>
                  <a href={item.path} className={linkClassName(item.path)}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* LOGO */}
          <div className="flex justify-center">
            <Link href="/">
              <img
                src={`https://beljumlah-11072023-28562543.dev.odoo.com${company.company_logo}`}
                alt={company.company_name}
                className="h-14 md:h-16"
              />
            </Link>
          </div>

          {/* RIGHT */}
          <nav className="hidden md:flex justify-end relative">
            <ul className="flex items-center gap-6 text-2xl">
              {rightItems.map((item: any) => (
                <li key={item.id}>
                  <a href={item.path} className={linkClassName(item.path)}>
                    {item.title}
                  </a>
                </li>
              ))}

              {/* Desktop Wishlist */}
              {user && (
                <li>
                  <button
                    onClick={() => router.push("/profile?tab=wishlist")}
                    className={`relative transition ${
                      isWishlistActive() ? "text-red-500" : "hover:text-red-400"
                    }`}
                  >
                    <Heart
                      size={28}
                      fill={isWishlistActive() ? "currentColor" : "none"}
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </li>
              )}

              {/* Avatar / Dropdown */}
              <li className="relative">
                {user ? (
                  <button
                    ref={triggerRef}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7a5a46] to-[#a67c5c] flex items-center justify-center font-bold shadow-md ring-2 ring-white/20">
                      {getUserInitials(user.name)}
                    </div>
                    <ChevronDown size={18} className="opacity-90" />
                  </button>
                ) : (
                  <a href="/login" className="hover:text-yellow-400">
                    <User size={28} />
                  </a>
                )}

                {/* Profile Dropdown */}
                {user && dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-14 w-50 rounded-2xl bg-white text-gray-800 shadow-2xl overflow-hidden border border-gray-100"
                  >
                    <div className="p-2 bg-gradient-to-r from-[#9c755b] to-[#b68b6f] text-white">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{user.name}</p>
                          <p className="text-xs opacity-90 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 md:-mt-2 md:-mb-8 px-4 py-3 rounded-xl hover:bg-gray-100 transition text-left"
                      >
                        <User
                          size={15}
                          className="w-10 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                        />
                        <p className="text-2xl font-medium">Profile</p>
                      </button>

                      <div className="h-px bg-gray-200 my-2" />

                      <button
                        onClick={() => setLogoutConfirmOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-left text-red-600"
                      >
                        <LogOut
                          size={18}
                          className="w-10 h-8 bg-red-50 rounded-full flex items-center justify-center"
                        />
                        <p className="font-medium text-2xl">Logout</p>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMenuOpen(true)}
          >
            &#9776;
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed top-0 right-0 h-full w-[280px] bg-black/90 backdrop-blur-md transform transition-transform duration-300 z-50 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={() => setMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <ul className="flex flex-col gap-2 px-4 py-5">
            {header
              .filter((item: any) => item.active)
              .map((item: any) => (
                <li key={item.id}>
                  <a
                    href={item.path}
                    className={`block px-3 py-3 rounded-xl ${linkClassName(item.path)}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}

            {/* Mobile Wishlist */}
            {user && (
              <li>
                <button
                  onClick={() => {
                    router.push("/profile?tab=wishlist");
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
                    isWishlistActive() ? "text-red-500" : "hover:text-red-400"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={isWishlistActive() ? "currentColor" : "none"}
                  />
                  Wishlist ({wishlistCount})
                </button>
              </li>
            )}

            {user ? (
              <>
                <li>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-left md:text-xl"
                  >
                    <User size={18} /> Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLogoutConfirmOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-left md:text-xl"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <a
                  href="/login"
                  className="block px-3 py-3 rounded-xl hover:bg-white/10"
                >
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>

        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </header>

      {/* LOGOUT MODAL */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setLogoutConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <ShieldCheck className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm logout
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to log out from your account?
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
