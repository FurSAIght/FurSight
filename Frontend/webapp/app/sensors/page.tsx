'use server';

import SensorCard from '@/components/sensors/card';
import CreateSensor from '@/components/sensors/create';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'; // <-- import here

export default async function Sensors({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { centralID } = await searchParams;

  const supabase = await createClient();

  if (!centralID || !Number(centralID)) {
    console.error('Central ID not provided or invalid');
    redirect('/centrals');
  }

  const central_id = Number(centralID);

  const { data: sensors, error } = await supabase
    .from('sensor')
    .select('*')
    .eq('central_id', central_id);

  if (error || !sensors) {
    console.error(error);
    redirect('/centrals');
  }

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger />
        <h1 className="semibold text-2xl">Sensors</h1>
        <CreateSensor central_id={central_id} />
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {sensors.map((sensor, i) => (
          <SensorCard key={i} {...sensor} />
        ))}
      </div>
    </>
  );
}
