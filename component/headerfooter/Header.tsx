"use client";

import { User, LogOut } from "lucide-react";
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

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  // ===================================================================
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ====================================================================
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

  const getUserInitials = (email = "") => {
    if (!email) return "";
    const name = email.trim().split(" ");
    return name.length > 1
      ? `${name[0][0]}${name[1][0]}`.toUpperCase()
      : name[0][0].toUpperCase();
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
      {/* HEADER CONTAINER */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Left Nav */}
        <nav className="hidden md:flex justify-start">
          <ul className="flex gap-8 text-2xl tracking-wide">
            {leftItems.map((item: any) => (
              <li key={item.id}>
                <a
                  href={item.path}
                  className="hover:text-yellow-400 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logo */}

        <div className="flex justify-center">
          <Link href="/" className="cursor-pointer">
            <img
              src={`https://beljumlah-11072023-28562543.dev.odoo.com${company.company_logo}`}
              alt={company.company_name}
              className="h-15 md:h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Nav */}
        <nav className="hidden md:flex justify-end">
          <ul className="flex items-center gap-8 text-2xl tracking-wide">
            {rightItems.map((item: any) => (
              <li key={item.id}>
                <a
                  href={item.path}
                  className="hover:text-yellow-400 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}

            {/* User Dropdown */}
            {user && dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-20 top-20 w-50 bg-white rounded-xl shadow-lg text-black z-50"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm text-gray-500">
                    {user?.email || "No email set"}
                  </p>
                  <p className="md:text-sm text-sm">{user.name}</p>
                </div>

                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-1"
                >
                  <User size={20} /> Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500 flex items-center gap-1 md:-mt-5"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            )}

            <li className="relative">
              {user ? (
                <div
                  ref={triggerRef}
                  className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getUserInitials(user.name)}
                </div>
              ) : (
                <a
                  href="/login"
                  className="p-2 hover:text-yellow-400 flex items-center"
                >
                  <User size={30} />
                </a>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden -mt-4 text-3xl"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[260px] bg-white/10 backdrop-blur-md text-white transform transition-transform duration-300 z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button className="text-3xl" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-6 px-6 text-lg">
          {header
            .filter((item: any) => item.active)
            .map((item: any) => (
              <li key={item.id}>
                <a
                  href={item.path}
                  className="hover:text-yellow-400"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.title}
                </a>
              </li>
            ))}

          {user ? (
            <>
              <li
                className="cursor-pointer hover:text-yellow-400"
                onClick={() => {
                  router.push("/profile");
                  setMenuOpen(false);
                }}
              >
                Profile
              </li>

              <li
                className="cursor-pointer text-red-400"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </li>
            </>
          ) : (
            <li>
              <a
                href="/login"
                className="hover:text-yellow-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
