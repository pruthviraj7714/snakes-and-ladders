"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex justify-between bg-pink-500 min-h-screen">
      {session?.user ? (
        <div className="flex flex-col">
          <button
            className="px-6 py-2 bg-red-400 text-black"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
          {JSON.stringify(session)}
          <button
            className="mt-5 bg-white text-black px-4 py-2 w-28"
            onClick={() => router.push("/home")}
          >
            GO To home
          </button>
        </div>
      ) : (
        <div
          onClick={async () => {
            await signIn("github", { callbackUrl: "/home" });
          }}
          className=""
        >
          <button>Login with Github</button>
        </div>
      )}
    </div>
  );
}
