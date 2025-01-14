'use client';

import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Camera, Cpu, PersonStanding, Thermometer, Trash, Volume, Zap } from 'lucide-react';
import { Central, SensorType } from '@/utils/types';
import EditCentral from '@/components/centrals/edit';
import SaveChanges from './save-changes';
import { createClient } from '@/utils/supabase/client';
import { toast } from '../hooks/use-toast';
import Link from 'next/link';

const getIcon = (type: SensorType) => {
  switch (type) {
    case SensorType.HUMID:
      return <Thermometer size={16} />;
    case SensorType.TEMP:
      return <Thermometer size={16} />;
    case SensorType.MOTION:
      return <PersonStanding size={16} />;
    case SensorType.CAM:
      return <Camera size={16} />;
    case SensorType.SOUND:
      return <Volume size={16} />;
    default:
      return <Zap size={16} />;
  }
};

export default function CentralCard({
  central,
  sensorsCount,
}: {
  central: Central;
  sensorsCount: number;
}) {

  async function deleteCentral() {
    const supabase = createClient();

    const { error } = await supabase.from('central').delete().eq('id', central.id);

    if (error) {
      toast({
        title: 'Failed to delete central!',
      });
    } else {
      toast({
        title: `Central ${central.name} was deleted successfully!`,
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="relative w-96 min-w-64 overflow-hidden">
        <div className="absolute -right-14 -top-7 opacity-10">
          <Cpu size={192} />
        </div>

        <CardHeader>
          <Link href={`/sensors?centralID=${central.id}`}>
            <CardTitle className="underline">{central.name}</CardTitle>
          </Link>
          <CardDescription>{central.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">Number of sensors: {sensorsCount}</div>
          <div className="flex flex-row place-items-center gap-2">
            {central.url}
            <SaveChanges {...central} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash /> Delete
            </Button>
          </AlertDialogTrigger>
          <EditCentral central={central} />
        </CardFooter>
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {central.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={deleteCentral}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
