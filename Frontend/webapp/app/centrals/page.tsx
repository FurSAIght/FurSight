import { SidebarTrigger } from '@/components/ui/sidebar';
import CreateCentral from '@/components/centrals/create';
import CentralCard from '@/components/centrals/card';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Central } from '@/utils/types';

export default async function Centrals({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  const { roomId } = await searchParams;

  if (!roomId || !Number(roomId)) {
    console.error('Room ID not provided or invalid');
    redirect('/rooms');
  }

  const room_id = Number(roomId);

  const { data: centrals } = await supabase
    .from('central')
    .select(
      `
      *,
      sensor (
        *
      ),
      central_config (
        *
      )
    `,
    )
    .eq('room_id', room_id);

  const { data: room, error } = await supabase
    .from('rooms')
    .select('name')
    .eq('id', room_id)
    .single();

  if (error || !room) {
    console.error(error);
    redirect('/rooms');
  }

  const { name } = room;

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger />
        <h1 className="semibold text-2xl">{name}'s Centrals</h1>
        <CreateCentral roomId={room_id} />
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {centrals?.map((central: Central, i) => (
          <CentralCard
            key={i}
            central={central}
            sensorsCount={centrals?.at(0).sensor.length || 0}
          />
        ))}
      </div>
    </>
  );
}
