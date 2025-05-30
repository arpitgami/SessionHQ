"use client";
import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/becomeexp", label: "Become An Expert" },
  { href: "/prstruct", label: "Project Structure" },
];

export const Navigation = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-neutral border-b shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          SessionHQ
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium text-white pb-1 border-b-2 transition-all duration-200 transform hover:scale-110 ${
                    isActive
                      ? "border-white scale-105"
                      : "border-transparent hover:scale-125"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Side: Auth / User */}
        <div className="hidden md:flex items-center gap-3 text-white font-medium">
          <SignedOut>
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 space-y-4 px-4 pb-4">
          <ul className="flex flex-col gap-3">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block text-sm font-medium text-white border-b-2 pb-1 ${
                      isActive ? "border-white" : "border-transparent"
                    }`}
                    onClick={() => setMenuOpen(false)} // Close menu on click
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-end items-center gap-4 text-white">
            <SignedOut>
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};
