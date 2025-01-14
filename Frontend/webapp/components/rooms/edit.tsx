'use client';

import {
  Form,
  FormControl,
  FormDescription,
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
import { useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { Cpu, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from '@/components/ui/dialog';
import { Room } from '@/utils/types';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
});

export default function EditRoom(room: Room) {
  async function getUserId() {
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    if (user.data.user)
      return user.data.user.id;
    else
      return '';
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name,
      description: room.description,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { error } = await supabase.from('rooms').update(data).eq('id', room.id)

    if (error) {
      toast({
        title: 'Failed to edit room!',
      })
    }
    else {
      toast({
        title: `Room ${room.name} edited successfully!`,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="z-10">
          <Edit />
          Edit Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room {room.id}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>A human readable name for the room</FormDescription>
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
                  <FormDescription>A short description of the room</FormDescription>
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
