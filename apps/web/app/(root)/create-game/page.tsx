"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../../../config/config";
import { useSession } from "next-auth/react";

const CreateGamePage = () => {
  const [bidAmount, setBidAmount] = useState(0);
    const [title, setTitle] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  //@ts-ignore
  const token = session?.user.accessToken;
  const createGame = async () => {
    try {
     await axios.post(
        `${BACKEND_URL}/game/create`,
        {
          bidAmount,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-sky-300 to-teal-400 flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <input onChange={(e) => setTitle(e.target.value)} type="text" className="text-black" placeholder="Enter Title for your game" />
        <input onChange={(e) => setBidAmount(Number(e.target.value))} type="text" className="text-black" placeholder="Enter bid amount for the game" />
        <button onClick={createGame} className="bg-yellow-400">
          Create Game
        </button>
      </div>
    </div>
  );
};

export default CreateGamePage;
