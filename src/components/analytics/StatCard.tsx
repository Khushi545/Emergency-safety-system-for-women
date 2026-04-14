"use client";

import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  duration?: number;
  isTime?: boolean;
}

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  suffix = "", 
  prefix = "",
  trend,
  duration = 1.5,
  isTime = false
}: StatCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value as string) || 0;
  const count = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(count, (latest) => {
    if (isTime) {
      if (latest < 1000) return `${Math.round(latest)}ms`;
      if (latest < 60000) return `${(latest / 1000).toFixed(1)}s`;
      return `${(latest / 60000).toFixed(1)}m`;
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    count.set(numericValue);
  }, [numericValue, count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary-light text-primary rounded-xl group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {trend.isUp ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-text-primary flex items-baseline gap-1">
          <span className="text-lg opacity-50 font-normal">{prefix}</span>
          <motion.span>{display}</motion.span>
          <span className="text-lg opacity-50 font-normal">{suffix}</span>
        </h3>
      </div>
    </motion.div>
  );
}
