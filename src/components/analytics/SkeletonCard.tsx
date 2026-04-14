"use client";

import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-card-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse" />
        <div className="w-16 h-6 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
        <div className="w-32 h-8 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
