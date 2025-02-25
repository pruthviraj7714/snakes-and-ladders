import Link from "next/link";
import { IGame } from "../types/types";

``;

const GameCard = ({ game }: { game: IGame }) => {
  return (
    <Link href={`/game/${game.id}`} className="flex flex-col items-center h-44">
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
    </Link>
  );
};

export default GameCard;
