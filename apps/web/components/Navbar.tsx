"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between h-16 p-4">
      <Link href={"/home"}>Logo</Link>

      <div className="flex justify-between gap-2 items-center">
        <Link href={"/create-game"}>Create Game</Link>
        <button
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
