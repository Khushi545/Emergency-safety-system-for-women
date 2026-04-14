"use client";

import { motion } from "framer-motion";

interface AlertHeatmapProps {
  data: number[][]; // 7 days (rows) x 24 hours (columns)
}

export default function AlertHeatmap({ data }: AlertHeatmapProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];

  // Normalize data for opacity calculation
  const maxVal = Math.max(...data.flat(), 1);

  return (
    <div className="bg-white p-6 rounded-3xl border border-card-border shadow-sm flex flex-col h-full">
      <div className="mb-6">
        <h3 className="font-bold text-lg text-text-primary">Activity heatmap</h3>
        <p className="text-sm text-text-secondary">Alerts by day × hour intensity</p>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header - Days */}
        <div className="flex mb-2 ml-10">
          {days.map((day) => (
            <div key={day} className="flex-1 text-center text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="flex-1 flex">
          {/* Y-Axis Labels - Hours */}
          <div className="flex flex-col justify-between py-1 pr-4 w-10">
            {hours.map((hour) => (
              <div key={hour} className="text-[11px] font-bold text-text-secondary text-right">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex-1 grid grid-cols-7 gap-1">
            {data.map((dayData, dayIdx) => (
              <div key={dayIdx} className="flex flex-col gap-1">
                {dayData.map((value, hourIdx) => (
                  <motion.div
                    key={hourIdx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (dayIdx * 24 + hourIdx) * 0.001 }}
                    className="flex-1 rounded-sm relative group cursor-pointer"
                    style={{
                      backgroundColor: value > 0 ? "rgba(155, 127, 212, 0.8)" : "#f8fafc",
                      opacity: value > 0 ? 0.2 + (value / maxVal) * 0.8 : 1,
                    }}
                  >
                    {value > 0 && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 rounded-sm flex items-center justify-center pointer-events-none">
                         <span className="text-[10px] font-bold text-primary">{value}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
