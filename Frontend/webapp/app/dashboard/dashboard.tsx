// eslint-disable no-explicit-any

'use client';

import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Chart } from '@/components/dashboards/chart';
import { AddChart } from '@/components/dashboards/create';
import { ChartData } from '@/utils/types';
import { createClient } from '@/utils/supabase/client';

interface DashboardClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  charts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sensors: any[];
}

export default function DashboardClient({ charts, sensors }: DashboardClientProps) {
  const [chartsWithSensorData, setChartsWithSensorData] = useState<ChartData[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const fetchData = async () => {
      const sensorDataPromises = charts?.map(async (chart) => {
        const sensorDataResponse = await supabase
          .from('sensor_data')
          .select('*')
          .eq('sensor_id', chart.sensor_id)
          .order('timestamp', { ascending: false })
          .limit(20);

        const formattedData = sensorDataResponse.data?.map((data) => ({
          value: parseFloat(data.value),
          time: data.timestamp,
        }));

        return {
          ...chart,
          data: formattedData,
        };
      });

      const chartsWithData = sensorDataPromises ? await Promise.all(sensorDataPromises) : [];
      setChartsWithSensorData(chartsWithData);
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [charts]);

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger />
        <h1 className="semibold text-2xl">Dashboard</h1>
        <AddChart sensors={sensors || []} />
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        <div className="flex flex-row flex-wrap justify-center gap-4">
          {charts.length === 0 ? (
            <div className="flex h-[300px] w-full items-center justify-center text-2xl">
              No charts available
            </div>
          ) : (
            chartsWithSensorData?.map((chart) => (
              <Chart key={chart.id} chart={chart} sensors={sensors} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
