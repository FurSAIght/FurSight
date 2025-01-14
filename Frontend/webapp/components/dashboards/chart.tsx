'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Line, Area, LineChart, AreaChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ChartData, ChartType, Sensor } from '@/utils/types';
import { EditChart } from './edit';

export function Chart({ chart, sensors }: { chart: ChartData; sensors: Sensor[] }) {
  const renderChart = () => {
    switch (chart.type) {
      case ChartType.AREA:
        return (
          <AreaChart data={chart.data}>
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              fill="var(--color-value)"
              stroke="var(--color-value)"
            />
          </AreaChart>
        );
      case ChartType.LINE:
        return (
          <LineChart data={chart.data}>
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case ChartType.TEMPERATURE:
        return (
          <AreaChart data={chart.data}>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#fc6f03] text-4xl opacity-100"
            >
              {chart.data[chart.data.length - 1].value}°C
            </text>
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#fc6f03] text-xl opacity-100"
            >
              {(chart.data[chart.data.length - 1].value * 9) / 5 + 32}°F
            </text>
            <Area
              type="monotone"
              dataKey="value"
              fill="#fc6f03"
              stroke="#fc6f03"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        );
      case ChartType.HUMIDITY:
        return (
          <AreaChart data={chart.data}>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--color-value)] text-4xl opacity-100"
            >
              {chart.data[chart.data.length - 1].value}%
            </text>
            <Area
              type="monotone"
              dataKey="value"
              fill="var(--color-value)"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        );
      default:
        return <div>No chart available</div>;
    }
  };

  chart.data.map((item) => (item.time = new Date(item.time).getTime()));

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {chart.name}
          <EditChart chart={chart} sensors={sensors} />
        </CardTitle>
        <CardDescription>{chart.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {chart.type === 'List' ? (
          <div className="h-52 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary text-primary">
                <TableRow>
                  <TableHead className="w-[100px]">Time</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="max-h-[100px] overflow-y-scroll">
                {chart.data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(item.time).toLocaleTimeString()}</TableCell>
                    <TableCell className="text-right">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <ChartContainer
            config={{
              value: {
                label: 'Value',
                color: 'hsl(var(--chart-1))',
              },
            }}
            className="h-[200px]"
          >
            {renderChart()}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
