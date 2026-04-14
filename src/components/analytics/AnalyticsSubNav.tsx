"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", href: "/analytics" },
  { label: "Contacts", href: "/analytics/contacts" },
  { label: "Evidence", href: "/analytics/evidence" },
];

export default function AnalyticsSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 p-1 bg-white border border-card-border rounded-2xl mb-8 w-fit shadow-sm">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href}>
            <div className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative",
              isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
            )}>
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-primary-light rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
