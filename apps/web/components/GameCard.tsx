import { IGame } from "../types/types";

``;

const GameCard = ({ game }: { game: IGame }) => {
  return (
    <div className="flex flex-col items-center h-44">
      <div className="flex h-36 w-full">
        <img
          src={
            "https://i.pinimg.com/736x/fc/77/3b/fc773b4cf19c71ea7b5d687d5d22ae94.jpg"
          }
          alt="board"
          className="opacity-50"
        />
      </div>
    </div>
  );
};

export default GameCard;
