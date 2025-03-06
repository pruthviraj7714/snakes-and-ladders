import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, Trophy, ArrowRight } from 'lucide-react'
import { fetchActiveRooms } from "../../../actions/roomActions"
import GameCard from "../../../components/GameCard"
import { IGame } from "../../../types/types"

export default async function Home() {
  const rooms: IGame[] = await fetchActiveRooms();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-b border-emerald-200 dark:border-slate-700">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                Snake Game Challenge
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-700 md:text-xl dark:text-slate-300">
                Join a room, challenge opponents, and become the ultimate snake master!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/create-game">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Game
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-slate-800">
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Active Games Section */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Active Game Rooms</h2>
              <p className="text-slate-600 dark:text-slate-400">Join an existing game or create your own</p>
            </div>
            <Link href="/all-games">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-800">
                View all games
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rooms.map((game: IGame) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-300 rounded-lg bg-white/50 dark:bg-slate-800/50 dark:border-slate-700">
              <Users className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 dark:text-slate-50 mb-2">No Active Rooms</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
                There are no active game rooms at the moment. Be the first to create one!
              </p>
              <Link href="/create-game">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Game Room
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-white/80 dark:bg-slate-800/50 border-t border-emerald-200 dark:border-slate-700">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-2 p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Trophy className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Compete & Win</h3>
              <p className="text-slate-600 dark:text-slate-400">Challenge other players and climb the leaderboard</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Multiplayer</h3>
              <p className="text-slate-600 dark:text-slate-400">Play with friends or match with random opponents</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <PlusCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Create Games</h3>
              <p className="text-slate-600 dark:text-slate-400">Set your own rules and bid amounts for custom games</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
