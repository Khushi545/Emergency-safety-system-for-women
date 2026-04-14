"use client";

import { motion } from "framer-motion";

interface GaugeChartProps {
  value: number;
  label: string;
}

export default function GaugeChart({ value, label }: GaugeChartProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-2xl border border-card-border shadow-sm flex flex-col items-center">
      <h3 className="font-bold text-text-primary mb-6 w-full">{label}</h3>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-100"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-text-primary">{value}%</span>
          <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1">Success</span>
        </div>
      </div>
    </div>
  );
}
