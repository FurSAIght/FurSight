import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Central } from '@/utils/types';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '../ui/drawer';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  flows: z.string(),
  date: z.date(),
});

export default function SaveChanges(central: Central) {
  // TODO: Remove this, currently used to test the applyFlow function
  const [val, setVal] = useState([]);
  console.log(val);

  const vers = central.central_config;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      flows: '',
      date: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    const res = await fetch(central.url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const flow = await res.json();

    // TODO: Remove this, currently used to test the applyFlow function
    setVal(flow);
    form.setValue('flows', flow);

    // TODO: Send data to the server
    toast({
      title: 'Changes saved successfully',
    });
  }

  async function applyFlow(flows: string) {
    const res = await fetch(central.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Node-RED-Deployment-Type': 'full',
      },
      body: JSON.stringify(flows),
    });

    if (res.ok) {
      toast({
        title: 'Flows applied successfully',
      });
    }
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" asChild>
                <a target="_blank" href={central.url}>
                  <ExternalLink />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open NodeRed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center gap-4">
          <DrawerTitle>Save Changes</DrawerTitle>
          <DrawerDescription className="text-center">
            Once you are done updating {central.name} flows' add a description and press the{' '}
            <span>Save</span> button to save the changes on FurSight.
            <br />
            You may also apply one of the previously saved flows by selecting it from the list.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex w-3/4 flex-col gap-2 self-center">
          <div className="flex max-h-32 flex-col gap-2 overflow-y-scroll">
            {vers.map((ver, i) => {
              return (
                <Button
                  onClick={() => applyFlow(ver.flows)}
                  key={i}
                  variant="ghost"
                  className="flex justify-between gap-2"
                >
                  <span>{ver.description}</span>
                  <span>{new Date(ver.created_at).toLocaleString()}</span>
                </Button>
              );
            })}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col items-center space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive Name for the changes made to the flows
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormDescription>
                      A description of the changes made to the flows
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerClose asChild>
                <Button type="submit">Save</Button>
              </DrawerClose>
            </form>
          </Form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
