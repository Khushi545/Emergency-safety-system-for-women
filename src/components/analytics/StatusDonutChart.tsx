"use client";

import { motion } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CHART_COLORS } from '@/lib/chart-theme';

interface StatusDonutChartProps {
  data: any[];
}

export default function StatusDonutChart({ data }: StatusDonutChartProps) {
  const COLORS = [CHART_COLORS.secondary, "#a7f3d0"]; // Pink and Emerald (matches Resolved 93% emerald style)

  // Map data to match screenshot labels specifically if we want to show percentages in labels directly
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex gap-4 mb-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-tighter">
              {entry.value} {data[index]?.value}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-3xl border border-card-border shadow-sm flex flex-col h-[400px]"
    >
      <div className="mb-4">
        <h3 className="font-bold text-lg text-text-primary">Alert status</h3>
        <p className="text-xs text-text-secondary">Active vs resolved</p>
      </div>
      
      <div className="flex-1 w-full flex flex-col items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Legend 
              verticalAlign="top" 
              align="left" 
              content={renderLegend}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              stroke="none"
              strokeLinecap="round"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
