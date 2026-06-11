"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface QuestionStatisticsChartsProps {
  questionType: "CHOICE" | "CHECKBOX";
  chartData: { name: string; value: number; percentage: number }[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];

/** recharts 번들 분리 대상 — `next/dynamic`으로만 로드 */
export function QuestionStatisticsCharts({
  questionType,
  chartData,
}: QuestionStatisticsChartsProps) {
  return (
    <>
      {/* Bar Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis allowDecimals={false} domain={[0, "dataMax"]} />
            <Tooltip
              formatter={(value: number | undefined) => [
                `${value}명 (${
                  chartData.find((d) => d.value === value)?.percentage
                }%)`,
                "응답 수",
              ]}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="응답 수">
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart (CHOICE 타입인 경우만) */}
      {questionType === "CHOICE" && (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  index,
                }) => {
                  if (
                    midAngle === undefined ||
                    innerRadius === undefined ||
                    outerRadius === undefined ||
                    cx === undefined ||
                    cy === undefined ||
                    index === undefined
                  ) {
                    return null;
                  }
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const dataEntry = chartData[index];

                  if (!dataEntry) {
                    return null;
                  }

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="var(--color-grey-700)"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={12}
                    >
                      {`${dataEntry.name}: ${dataEntry.percentage}%`}
                    </text>
                  );
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) => {
                  const dataEntry = chartData.find((d) => d.value === value);
                  if (!dataEntry) {
                    return [`${value}명`, "응답 수"];
                  }
                  return [`${value}명 (${dataEntry.percentage}%)`, "응답 수"];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
