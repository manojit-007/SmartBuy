/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const Charts = ({ data }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const totalCounts = data.reduce((acc, curr) => acc + curr.counts, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart for Products</CardTitle>
        <CardDescription>
          January 2025 - {currentMonth} {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={data}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="counts"
              nameKey="status"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              stroke="transparent"
              strokeWidth={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox?.cx && viewBox?.cy) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCounts.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Products
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total Products
        </div>
      </CardFooter>
    </Card>
  );
};

export default Charts;
