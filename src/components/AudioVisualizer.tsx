"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AudioVisualizer({ isRecording }: { isRecording: boolean }) {
  const [bars, setBars] = useState<number[]>(new Array(12).fill(20));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setBars(new Array(12).fill(0).map(() => Math.floor(Math.random() * 40) + 10));
      }, 100);
    } else {
      setBars(new Array(12).fill(10));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-center gap-1.5 h-12">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-1.5 bg-secondary rounded-full"
        />
      ))}
    </div>
  );
}
