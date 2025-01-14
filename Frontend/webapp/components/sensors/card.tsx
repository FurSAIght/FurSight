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
import { Camera, PersonStanding, Thermometer, Trash, Volume, Zap } from 'lucide-react';
import EditSensor from '@/components/sensors/edit';
import { Sensor, SensorType } from '@/utils/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { toast } from '../hooks/use-toast';

const getIcon = (type: SensorType) => {
  switch (type) {
    case SensorType.HUMID:
      return <Thermometer size={192} />;
    case SensorType.TEMP:
      return <Thermometer size={192} />;
    case SensorType.MOTION:
      return <PersonStanding size={192} />;
    case SensorType.CAM:
      return <Camera size={192} />;
    case SensorType.SOUND:
      return <Volume size={16} />;
    default:
      return <Zap size={192} />;
  }
};

const getTooltip = (type: SensorType) => {
  switch (type) {
    case SensorType.HUMID:
      return 'Humidity sensor';
    case SensorType.TEMP:
      return 'Temperature sensor';
    case SensorType.MOTION:
      return 'Motion sensor';
    case SensorType.CAM:
      return 'Camera sensor';
    default:
      return 'Unknown sensor';
  }
};

export default function SensorCard(sensor: Sensor) {
  async function deleteSensor() {
    const supabase = createClient();

    const { error } = await supabase.from('sensor').delete().eq('id', sensor.id);

    if (error) {
      toast({
        title: 'Failed to delete sensor!',
      });
    } else {
      toast({
        title: `Sensor ${sensor.name} was deleted successfully!`,
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="relative w-96 min-w-64 overflow-hidden">
        <div className="absolute -right-16 -top-7 opacity-10">{getIcon(sensor.type)}</div>
        <CardHeader>
          <Link href={`/dashboard?sensorID=${sensor.id}`}>
            <CardTitle className="underline">{sensor.name}</CardTitle>
          </Link>
          <CardDescription>{sensor.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="cursor-default">{sensor.type}</Badge>
                </TooltipTrigger>
                <TooltipContent>{getTooltip(sensor.type)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-row place-items-center gap-2"></div>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash /> Delete
            </Button>
          </AlertDialogTrigger>
          <EditSensor {...sensor} />
        </CardFooter>
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {sensor.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={deleteSensor}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
