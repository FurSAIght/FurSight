'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Camera, Edit, PersonStanding, Thermometer, Volume, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from '@/components/ui/dialog';
import { Sensor, SensorType } from '@/utils/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  name: z.string().min(1).max(255),
  id: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  type: z.string(),
});

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

export default function EditSensor(sensor: Sensor) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: sensor.name,
      id: sensor.id,
      description: sensor.description,
      type: sensor.type,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const name = sensor.name;
    
    async function pushData() {
      const supabase = createClient();
      const { data: sensor, error } = await supabase
        .from('sensor')
        .update(data)
        .match({ id: data.id });

      if (error) {
        console.error(error);
        
        toast({
          title: `Failed to edit sensor!`,
        });

        return;
      } else {
        toast({
          title: `Sensor ${name} edited successfully!`,
        });
      }

      console.log(sensor);
    }

    pushData();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="z-10">
          <Edit /> Edit Sensor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room {sensor.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sensor type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SensorType).map((type) => (
                          <SelectItem key={type} value={type} className="cursor-pointer">
                            <div className="flex flex-row items-center gap-3">
                              {getIcon(type)} {type}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
