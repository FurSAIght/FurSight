import { Button } from '@/components/ui/button';
import { LogIn, UserPlus2 } from 'lucide-react';
import Image from 'next/image';

export default async function Index() {
  return (
    <>
      <main className="flex h-full w-full flex-1 flex-col items-center justify-center gap-6">
        <Image src="/logo.svg" alt="FurSight" width="200" height="200" />
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">FurSight</h1>
          <p>Insights for your pets :3</p>
        </div>
        <div className="flex flex-row gap-5">
          <Button asChild>
            <a href="/sign-in">
              <LogIn />
              Sign in
            </a>
          </Button>
          <Button asChild>
            <a href="/sign-up">
              <UserPlus2 /> Sign up
            </a>
          </Button>
        </div>
      </main>
    </>
  );
}
