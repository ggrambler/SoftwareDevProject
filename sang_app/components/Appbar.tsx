"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import VTicon from "@/public/favicon.png"; 


function Appbar() {
  const { data: session, status } = useSession();

  console.log("Session Data from useSession():", session);

  const userName = session?.user?.name || "Guest";
  const userEmail = session?.user?.email || "No Email";

  return (
    <div className="appbar justify-between items-center bg-zinc-800 p-5 flex w-screen">
      <a href="/">
      <div className="text-white italic text-3xl font-bold flex items-center">VidTeams
        
      <Image src={VTicon} alt="VidTeams Logo" width={70} height={70} className="filter invert"/>
      </div>
      </a>
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
