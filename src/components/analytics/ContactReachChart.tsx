"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-theme";
import { motion } from "framer-motion";

interface ContactReachChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export default function ContactReachChart({ data, height = 300 }: ContactReachChartProps) {
  const COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white p-6 rounded-2xl border border-card-border shadow-sm"
    >
      <h3 className="font-bold text-text-primary mb-6">Contact Reach Rate</h3>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: "12px", 
                border: "none", 
                boxShadow: "0 10px 15px -3px rgba(155, 127, 212, 0.15)",
                padding: "12px"
              }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
