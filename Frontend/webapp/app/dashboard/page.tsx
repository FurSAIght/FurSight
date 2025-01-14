import { createClient } from '@/utils/supabase/server';
import DashboardClient from './dashboard';
import { redirect } from 'next/navigation';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  const { sensorID } = await searchParams;

  if (!sensorID) {
    console.error('Sensor ID not provided or invalid');
    redirect('/sensors');
  }

  const { data: charts, error: chartsError } = await supabase
    .from('chart')
    .select('*')
    .eq('sensor_id', sensorID);

  const { data: sensors, error: sensorsError } = await supabase
    .from('sensor')
    .select('*')
    .eq('id', sensorID);

  if (chartsError || sensorsError) {
    console.error(chartsError || sensorsError);
    redirect('/sensors');
  }

  return <DashboardClient charts={charts} sensors={sensors} />;
}
