'use client';

import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogHeader, DialogTrigger, DialogContent } from '../ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '../hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChartType, Sensor } from '@/utils/types';
import { DialogTitle } from '@radix-ui/react-dialog';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  sensor_id: z.string(),
  type: z.string(),
});

export function AddChart({ sensors }: { sensors: Sensor[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      sensor_id: '',
      type: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { error } = await supabase.from('chart').insert(data);

    if (error) {
      toast({
        title: 'Failed to create chart!',
      });
    } else {
      toast({
        title: 'Chart created successfully!',
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Chart
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Chart</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormDescription>The title of the graph</FormDescription>
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
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>A short description of the graph's purpose</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full flex-row gap-4">
              <FormField
                control={form.control}
                name="sensor_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sensor</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select sensor" />
                        </SelectTrigger>
                        <SelectContent>
                          {sensors.map((sensor: Sensor, i) => (
                            <SelectItem key={i} value={sensor.id}>
                              <div className="flex flex-row items-center gap-3">{sensor.name}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ChartType).map((chart: string, i) => (
                          <SelectItem key={i} value={chart}>
                            {chart}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
