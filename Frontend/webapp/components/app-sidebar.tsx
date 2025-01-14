/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ChevronUp,
  Cpu,
  House,
  LayoutDashboard,
  LogIn,
  LogOut,
  User2,
  UserPlus2,
  Zap,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOutAction } from '@/app/actions';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

// Menu items.

export async function AppSidebar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: any[] = [];
  let itemsBottom;

  if (user) {
    items = [
      /**{
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Rooms',
        url: '/rooms',
        icon: House,
      },
      {
        title: 'Centrals',
        url: '/centrals',
        icon: Cpu,
      },*/
      {
        title: 'Rooms',
        url: '/rooms',
        icon: House,
      },
    ];
    itemsBottom = (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User2 /> {user.email}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
            <form action={signOutAction}>
              <button type="submit" className="w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  } else {
    items = [];
    itemsBottom = (
      <>
        <SidebarMenuItem className="flex w-full flex-row gap-3">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/sign-in">
              <LogIn /> Sign in
            </a>
          </Button>
        </SidebarMenuItem>
        <SidebarMenuItem className="flex w-full flex-row gap-3">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/sign-up">
              <UserPlus2 /> Sign up
            </a>
          </Button>
        </SidebarMenuItem>
      </>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href="/" className="flex flex-row gap-3 pl-3 pt-3 font-semibold">
            <Image src="/logo.svg" width="24" height="24" alt="FurSight Logo" />
            <h1>FurSight</h1>
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          {user ? (
            <>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          ) : (
            <></>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        <SidebarMenu>{itemsBottom}</SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
