"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BACKEND_URL } from "../config/config"
import type { IGame } from "../types/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Users, DollarSign } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const GameCard = ({ game }: { game: IGame }) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteGame = async () => {
    try {
      setIsDeleting(true)
      await axios.delete(`${BACKEND_URL}/game/${game.id}`)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md dark:bg-slate-800 dark:border-slate-700 h-full">
      <Link href={`/game/${game.id}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/fc/77/3b/fc773b4cf19c71ea7b5d687d5d22ae94.jpg"
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-emerald-600 hover:bg-emerald-700">
            <DollarSign className="h-3 w-3 mr-1" />
            {game.bidAmount}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{game.title}</h3>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Users className="h-4 w-4 mr-1" />
            {/* <span>
              {game.player1?.length || 0} player{(game.players?.length || 0) !== 1 ? "s" : ""}
            </span> */}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={(e) => e.stopPropagation()}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Game"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the game room "{game.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteGame}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

export default GameCard

