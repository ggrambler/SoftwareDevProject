"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import VTicon from "@/public/favicon.png"; 

function generateSessionCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 2; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
}

function Appbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userName = session?.user?.name || "Guest";

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default Link behavior
    const newScode = generateSessionCode();
    router.push(`/?session=${newScode}`);
  };

  return (
    <div className="appbar justify-between items-center bg-zinc-800 p-5 flex w-screen">
      {/*
        Use a Link for better Next.js prefetching, but override the onClick to generate the code.
        The href can be "#" or the same route, since we'll override it anyway.
      */}
      <Link href="#" onClick={handleLogoClick}>
        <div className="text-white italic text-3xl font-bold flex items-center cursor-pointer">
          VidTeams
          <Image
            src={VTicon}
            alt="VidTeams Logo"
            width={70}
            height={70}
            className="filter invert"
          />
        </div>
      </Link>

      <div className="text-gray-400 mr-4">
        {status === "loading" ? "Loading..." : `Hello ${userName}`}
      </div>
      <div>
        {session?.user ? (
          <Button variant="outline" onClick={() => signOut()}>
            LogOut
          </Button>
        ) : (
          <Button variant="outline" onClick={() => signIn("google")}>
            SignIn
          </Button>
        )}
      </div>
    </div>
  );
}

export default Appbar;
