'use client'

import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { badgeVariants } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Cpu, Home, Trash } from 'lucide-react';
import Link from 'next/link';
import EditRoom from '@/components/rooms/edit';
import { Room } from '@/utils/types';
import { createClient } from '@/utils/supabase/client';
import { toast } from '../hooks/use-toast';

export default function RoomCard({ room }: { room: Room }) {
  async function deleteRoom() {
    const supabase = createClient();

    const { error } = await supabase.from('rooms').delete().eq('id', room.id);

    if (error) {
      toast({
        title: 'Failed to delete room!',
      });
    } else {
      toast({
        title: `Room ${room.name} was deleted successfully!`,
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="relative w-96 min-w-64 overflow-hidden">
        <div className="absolute -right-16 -top-7 opacity-10">
          <Home size={192} />
        </div>
        <CardHeader className="flex w-full flex-row items-center justify-between">
          <Link href={`/centrals?roomId=${room.id}`}>
            <CardTitle className="underline">{room.name}</CardTitle>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row gap-3">
            {room.central.map((central: { name: string; id: number }, i) => (
              <p key={i} className={badgeVariants({ variant: 'default' })}>
                <Cpu /> {central.name}
              </p>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash /> Delete
            </Button>
          </AlertDialogTrigger>
          <EditRoom {...room} />
        </CardFooter>
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {room.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={deleteRoom}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
