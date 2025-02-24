import { fetchActiveRooms } from "../../../actions/roomActions";
import GameCard from "../../../components/GameCard";
import { IGame } from "../../../types/types";

export default async function Home() {
  const rooms = await fetchActiveRooms();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-teal-200 via-sky-300 to-teal-400">
      <div className="text-center mt-10 font-bold text-2xl text-pretty">
        Welcome, Join Room And Play 🐍
      </div>
      <div className="my-8">
        <div className="grid grid-cols-4 gap-5">
          {rooms && rooms.length > 0 ? (
            rooms.map((r : IGame) => <GameCard game={r} />)
          ) : (
            <div>NO Rooms found!</div>
          )}
        </div>
      </div>
    </div>
  );
}
