"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Landing() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between bg-pink-500 min-h-screen">
      {session?.user ? (
        <div>
          <button onClick={() => signOut()}>Logout</button>
          {JSON.stringify(session)}
        </div>
      ) : (
        <div onClick={() => signIn("github")} className="">
          <button>Login with Github</button>
        </div>
      )}
    </div>
  );
}
