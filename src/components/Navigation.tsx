"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Users, 
  History, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  BarChart2
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Safety Home", href: "/home" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Emergency Contacts", href: "/contacts" },
  { icon: History, label: "Alert History", href: "/history" },
  { icon: User, label: "My Profile", href: "/profile" },
];

export default function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Remove cookie
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      router.push("/login");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-primary-light border-r border-card-border flex flex-col transition-all duration-300 relative z-50"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl text-text-primary whitespace-nowrap"
          >
            StaySafe
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all relative group",
                  isActive 
                    ? "bg-white text-primary shadow-premium" 
                    : "text-text-secondary hover:bg-white/50 hover:text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className="w-6 h-6 shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-card-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-text-secondary hover:bg-secondary/10 hover:text-secondary-dark transition-all"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium whitespace-nowrap"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-card-border p-1 rounded-full shadow-md text-text-secondary hover:text-primary transition-all"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
