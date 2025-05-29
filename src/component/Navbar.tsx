"use client";
import Link from "next/link";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/becomeexp", label: "Become An Expert" },
  { href: "/prstruct", label: "Project Structure" },
];
export const Navigation = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className="bg-neutral border-b shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold text-white">
            SessionHQ
          </Link>
        </div>
        {/* Navigation Links */}
        <ul className="flex items-center gap-6 ">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium text-white pb-1  border-b-2 transition-all duration-200 transform hover:scale-110 ${
                    isActive
                      ? "border-white scale-105"
                      : "border-transparent hover:scale-125"
                  }`}
                >
                  {" "}
                  {label}{" "}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Right: Profile or Placeholder */}
        <div className="flex items-center gap-3">
          {/* <Link h className="text-sm font-medium text-white "> */}
          <header className="flex text-white font-medium justify-end items-center">
            <SignedOut>
              {/* <SignInButton /> */}
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {/* </Link> */}
        </div>
      </div>
    </nav>
  );
};
