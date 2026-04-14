"use client";

import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '@/lib/chart-theme';

interface WeeklyBarChartProps {
  data: any[];
}

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  // Sample data to match screenshot weekly pattern
  const sampleData = [
    { day: "Mon", count: 16 },
    { day: "Tue", count: 12 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 18 },
    { day: "Fri", count: 24 },
    { day: "Sat", count: 28 },
    { day: "Sun", count: 14 },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-3xl border border-card-border shadow-sm flex flex-col h-[350px]"
    >
      <div className="mb-4">
        <h3 className="font-bold text-lg text-text-primary">Alerts by day</h3>
        <p className="text-xs text-text-secondary">Weekly pattern</p>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis 
              dataKey="day" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              width={40}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              fill={CHART_COLORS.secondary} 
              radius={[0, 4, 4, 0]} 
              barSize={20}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
