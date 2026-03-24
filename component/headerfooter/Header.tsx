"use client";

import { User, LogOut, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import Link from "next/link";

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

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.items.length,
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
  };

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#9c755b] shadow-lg" : "bg-transparent"
      } text-white`}
    >
      {/* HEADER */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* LEFT */}
        <nav className="hidden md:flex justify-start">
          <ul className="flex gap-8 text-2xl">
            {leftItems.map((item: any) => (
              <li key={item.id}>
                <a href={item.path} className="hover:text-yellow-400">
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
        <nav className="hidden md:flex justify-end">
          <ul className="flex items-center gap-6 text-xl">
            {/* Static Right Items */}
            {rightItems.map((item: any) => (
              <li key={item.id}>
                <a href={item.path} className="hover:text-yellow-400">
                  {item.title}
                </a>
              </li>
            ))}

            {/* ❤️ Wishlist */}
            {user && (
              <li>
                <button
                  onClick={() => router.push("/profile?tab=wishlist")}
                  className="relative hover:text-red-400 transition"
                >
                  <Heart size={28} />

                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </li>
            )}

            {/* USER DROPDOWN */}
            {user && dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-20 top-20 w-52 bg-white rounded-xl shadow-lg text-black z-50"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm">{user.name}</p>
                </div>

                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex gap-2"
                >
                  <User size={18} /> Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500 flex gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}

            {/* AVATAR */}
            <li className="relative">
              {user ? (
                <div
                  ref={triggerRef}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold cursor-pointer"
                >
                  {getUserInitials(user.name)}
                </div>
              ) : (
                <a href="/login" className="hover:text-yellow-400">
                  <User size={28} />
                </a>
              )}
            </li>
          </ul>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[260px] bg-black/80 backdrop-blur-md transform transition ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <ul className="flex flex-col gap-6 px-6">
          {header
            .filter((item: any) => item.active)
            .map((item: any) => (
              <li key={item.id}>
                <a href={item.path} onClick={() => setMenuOpen(false)}>
                  {item.title}
                </a>
              </li>
            ))}

          {/* ❤️ Mobile Wishlist */}
          {user && (
            <li
              onClick={() => {
                router.push("/profile?tab=wishlist");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Heart size={20} /> Wishlist ({wishlistCount})
            </li>
          )}

          {user ? (
            <>
              <li
                onClick={() => {
                  router.push("/profile");
                  setMenuOpen(false);
                }}
              >
                Profile
              </li>

              <li
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-red-400"
              >
                Logout
              </li>
            </>
          ) : (
            <li>
              <a href="/login">Login</a>
            </li>
          )}
        </ul>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
