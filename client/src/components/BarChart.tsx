import useDemoConfig from "../utils/useChartConfig";
import React from "react";
import { AxisOptions, Chart } from "react-charts";

export default function BarChart({ className }: { className?: string }) {
  const { data, randomizeData } = useDemoConfig({
    series: 3,
    dataType: "ordinal",
  });

  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  return (
    <>
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
        className={className}
      />
    </>
  );
}
