"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface DateRangePickerProps {
  onRangeChange: (range: { start: Date; end: Date }) => void;
}

export default function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Last 30 Days");

  const ranges = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "All Time", days: 365 }, // Simplified
  ];

  const handleSelect = (range: typeof ranges[0]) => {
    setSelectedLabel(range.label);
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, range.days));
    onRangeChange({ start, end });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-card-border rounded-xl text-sm font-medium hover:border-primary/50 transition-all shadow-sm"
      >
        <Calendar size={16} className="text-primary" />
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-card-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {ranges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleSelect(range)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-light transition-colors ${
                  selectedLabel === range.label ? "text-primary font-bold bg-primary-light/50" : "text-text-primary"
                }`}
              >
                {range.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
