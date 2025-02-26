'use client'

import Link from "next/link";
import { IGame } from "../types/types";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { useRouter } from "next/navigation";

``;


const GameCard = ({ game }: { game: IGame }) => {
  const router = useRouter();

  const deleteGame = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await axios.delete(`${BACKEND_URL}/game/${game.id}`);
      router.refresh();
    } catch (error : any) {
      alert(error.message);
    }
  }
  return (
    <Link href={`/game/${game.id}`} className="flex flex-col items-center h-64">
      <div className="flex h-36 w-full">
        <img
          src={
            "https://i.pinimg.com/736x/fc/77/3b/fc773b4cf19c71ea7b5d687d5d22ae94.jpg"
          }
          alt="board"
          className="cursor-pointer hover:opacity-80"
        />
      </div>
      <div className="font-bold text-black text-xl">
        <span>{game.title} - ${game.bidAmount}</span>
      </div>
      <div className="my-2">
        <button onClick={deleteGame} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Delete
          </button>
      </div>
    </Link>
  );
};

export default GameCard;
