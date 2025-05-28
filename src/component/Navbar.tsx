"use client";
import Link from "next/link";
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
    <nav className="bg-white border-b shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          SessionHQ
        </Link>
        {/* Navigation Links */}
        <ul className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname.startsWith(href) ? "text-gray-600" : "text-blue-700"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
