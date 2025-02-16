"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import VTicon from "@/public/favicon.png"; 


function Appbar() {
  const { data: session, status } = useSession();

  console.log("Session Data from useSession():", session);

  const userName = session?.user?.name || "Guest";

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

  const newScode = generateSessionCode();
  const routeScode = `/?session=${newScode}`;

  return (
    <div className="appbar justify-between items-center bg-zinc-800 p-5 flex w-screen">
      <Link href={routeScode}>
      <div className="text-white italic text-3xl font-bold flex items-center">VidTeams
      <Image src={VTicon} alt="VidTeams Logo" width={70} height={70} className="filter invert"/>
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