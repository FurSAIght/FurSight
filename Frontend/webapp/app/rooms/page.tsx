import CreateRoom from '@/components/rooms/create';
import RoomCard from '@/components/rooms/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/server';

export default async function Rooms() {
  const supabase = await createClient();
  const roomsResponse = await supabase.from('rooms').select(`
      *,
      central(
        *
      )
    `);

  const rooms = roomsResponse.data;

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger />
        <h1 className="semibold text-2xl">Rooms</h1>
        <CreateRoom />
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {rooms?.map((room) => <RoomCard key={room.id} room={room} />)}
      </div>
    </>
  );
}
