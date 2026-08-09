"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "What's Included", href: "#whats-included" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <motion.nav
        aria-label="Main navigation"
        animate={{
          borderRadius: open ? 28 : 999,
          paddingTop: open ? 16 : 12,
          paddingBottom: open ? 16 : 12,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "w-full max-w-5xl transition-[box-shadow,background-color,border-color] duration-500",
          open
            ? "glass-strong shadow-lift"
            : scrolled
              ? "glass-strong shadow-lift"
              : "glass-subtle shadow-soft",
        )}
      >
        <div className="flex items-center justify-between px-5 sm:px-6">
          <Logo href="#top" priority />

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:bg-black/[0.04] hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="https://entrepreneursjantaparty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full px-3 py-2 text-xs font-medium text-ink-muted transition-colors duration-200 hover:bg-black/[0.04] hover:text-ink sm:inline-flex"
            >
              EJP
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="#pricing">
                Get Instant Access
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden md:hidden"
            >
              <ul className="mt-3 flex flex-col gap-1 border-t border-line px-3 pt-3 pb-1">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-black/[0.04]"
                    >
                      {link.label}
                      <ArrowUpRight className="size-4 text-ink-faint" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://entrepreneursjantaparty.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-black/[0.04]"
                  >
                    EJP — Entrepreneurs Janta Party
                    <ArrowUpRight className="size-4 text-ink-faint" aria-hidden="true" />
                  </a>
                </li>
                <li className="pb-3 pt-2">
                  <Button asChild className="w-full">
                    <Link href="#pricing" onClick={() => setOpen(false)}>
                      Get Instant Access
                    </Link>
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
