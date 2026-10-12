import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface UsageAreaChartProps {
  data: Array<{
    name: string;
    chats: number;
    images: number;
  }>;
}

export default function UsageAreaChart({ data }: UsageAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#71717A" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#71717A" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#161616",
            borderColor: "#242424",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="chats"
          stroke="#F59E0B"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorChats)"
        />
        <Area
          type="monotone"
          dataKey="images"
          stroke="#3B82F6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorImages)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
