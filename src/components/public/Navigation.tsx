"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "My Articles", href: "/articles" },
    { label: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE6DD]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity */}
        <Link
          href="/"
          className="group flex flex-col text-left transition-opacity hover:opacity-85"
        >
          <span className="font-heading text-2xl sm:text-[1.75rem] font-medium tracking-tight text-[#171614]">
            Hammad&apos;s Journal
          </span>
          <span className="text-[0.7rem] uppercase tracking-widest text-[#7C766D] font-sans font-medium -mt-0.5">
            Personal Publication
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-[0.95rem] font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1.5 transition-colors duration-200 ${
                  active
                    ? "text-[#171614] font-semibold"
                    : "text-[#6E6960] hover:text-[#171614]"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#945B1C] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#4A463F] hover:text-[#171614] transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EBE6DD] bg-[#FAF8F5] px-6 py-4 space-y-3">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base ${
                  active
                    ? "text-[#171614] font-semibold"
                    : "text-[#6E6960] hover:text-[#171614]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
