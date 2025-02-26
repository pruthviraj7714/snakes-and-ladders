"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Dice from "./Dice";
import { useSession } from "next-auth/react";
import { BiLoader } from "react-icons/bi";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { useRouter } from "next/navigation";

type PlayerType = {
  id: 1 | 2;
  userId: string;
  position: number;
  emoji: string;
};

type GameStateType = {
  player1: string;
  player2: string;
  player1Position: number;
  player2Position: number;
  currentPlayer: 1 | 2;
};

export default function Board({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [number, setNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const { ws, wsError } = useSocket();
  const [currentGameState, setCurrentGameState] =
    useState<GameStateType | null>(null);
  const { data: session } = useSession();
  //@ts-ignore
  const userId = session?.user.id;

  const squares = Array.from({ length: 100 }, (_, i) => 100 - i);
  const router = useRouter();

  const snakes = {
    97: 78,
    95: 75,
    88: 24,
    62: 19,
    36: 6,
  };

  const ladders = {
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    51: 67,
  };

  const PLAYER_EMOJIS = {
    1: "😎",
    2: "😄",
  };

  const movePlayer = (spaces: number, position? : number) => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (player.id === currentPlayer) {
          let newPosition = player.position + spaces;

          if (newPosition >= 100) {
            setGameWon(true);
            newPosition = 100;

            if (ws) {
              ws.send(
                JSON.stringify({
                  type: "GAME_WON",
                  gameId,
                  playerId: player.id,
                  userId,
                })
              );
            }
          }

          if (newPosition in snakes) {
            ws?.send(JSON.stringify({
              type : "SNAKE_ATE",
              userId,
              gameId
            }))
          }

          if (newPosition in ladders) {
            ws?.send(JSON.stringify({
              type : "LADDER_FOUND",
              userId,
              gameId
            }))
          }

          return { ...player, position: position ? position : newPosition };
        }
        return player;
      });
    });

    if (!gameWon) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const fetchInitialGameState = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/game/${gameId}`);
      const game = res.data.game;

      // Reset players array first to avoid duplicates
      setPlayers([]);

      // Add player 1
      if (game.player1) {
        setPlayers((prev) => [
          ...prev,
          {
            id: 1,
            userId: game.player1,
            position: Number(game.player1Position) || 1,
            emoji: PLAYER_EMOJIS[1],
          },
        ]);
      }

      // Add player 2 if exists
      if (game.player2) {
        setPlayers((prev) => [
          ...prev,
          {
            id: 2,
            userId: game.player2,
            position: Number(game.player2Position) || 1,
            emoji: PLAYER_EMOJIS[2],
          },
        ]);
      }

      // Set current player
      setCurrentPlayer(game.currentPlayer || 1);
      setCurrentGameState(game);
    } catch (error: any) {
      console.error("Error fetching game state:", error.message);
      alert("Failed to load game: " + error.message);
    }
  };

  // Initial game state fetch
  useEffect(() => {
    fetchInitialGameState();
  }, [gameId]);

  // WebSocket handler
  useEffect(() => {
    if (!ws || !userId) return;

    ws.send(
      JSON.stringify({
        type: "JOIN_GAME",
        gameId,
        userId,
      })
    );

    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      switch (msg.type) {
        case "PLAYER_JOINED":
          fetchInitialGameState();
          break;

        case "ROOM_LEFT":
          if (players.some((p) => p.userId === msg.userId)) {
            setPlayers((prev) => prev.filter((p) => p.userId !== msg.userId));
          }
          setCurrentGameState(msg.game);
          break;

        case "DICE_ROLLED":
          setNumber(Number(msg.diceRoll));
          movePlayer(Number(msg.diceRoll));
          setCurrentGameState(msg.game);
          break;

        case "SNAKE_EATEN_OUT":
        movePlayer(0, userId === msg.player1 ? msg.game.player1Position : msg.game.player2Position);
        break;

        case "RISED_ON_LADDER":
        movePlayer(0, userId === msg.player1 ? msg.game.player1Position : msg.game.player2Position);
        break;
          
        case "GAME_WON":
          setGameWon(true);
          break;
      }
    };

    return () => {
      ws.send(
        JSON.stringify({
          type: "LEAVE_GAME",
          userId,
          gameId,
        })
      );
      ws.close();
    };
  }, [ws, userId, gameId]);

  // Draw snakes and ladders on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const squareSize = canvas.width / 10;

    const getCoordinates = (number: number) => {
      const row = Math.floor((100 - number) / 10);
      const col =
        row % 2 === 0
          ? number % 10 === 0
            ? 9
            : (number % 10) - 1
          : number % 10 === 0
            ? 0
            : 10 - (number % 10);
      return {
        x: col * squareSize + squareSize / 2,
        y: row * squareSize + squareSize / 2,
      };
    };

    Object.entries(snakes).forEach(([from, to]) => {
      const start = getCoordinates(Number(from));
      const end = getCoordinates(Number(to));

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);

      const cp1x = start.x;
      const cp1y = (start.y + end.y) / 2;
      const cp2x = end.x;
      const cp2y = (start.y + end.y) / 2;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    Object.entries(ladders).forEach(([from, to]) => {
      const start = getCoordinates(Number(from));
      const end = getCoordinates(Number(to));

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.stroke();
    });
  }, [players]);

  // Loading state
  if (players.length < 2) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="bg-white text-black rounded-xl px-8 py-8">
          Waiting for other player to join game
          <BiLoader className="animate-spin size-7 mx-auto my-4" />
        </div>
      </div>
    );
  }

  // Get player numbers for current user
  const isPlayer1 = players[0]?.userId === userId;
  const isPlayer2 = players[1]?.userId === userId;
  const myPlayerNumber = isPlayer1 ? 1 : isPlayer2 ? 2 : null;

  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-gray-100 p-4 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <h2
            className={`mb-2 text-lg font-bold ${currentPlayer === 1 ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            Player 1 {isPlayer1 ? "(You)" : ""}{" "}
            {currentPlayer === 1 ? "(Turn)" : ""}
          </h2>
          <div className="flex gap-2">
            <Dice
              number={number}
              disabled={
                !isPlayer1 || currentPlayer !== 1 || isRolling || gameWon
              }
              onClick={() => {
                setIsRolling(true);
                ws?.send(
                  JSON.stringify({
                    type: "ROLL_DICE",
                    userId,
                    gameId,
                  })
                );
                // Reset rolling state after animation
                setTimeout(() => setIsRolling(false), 1000);
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="grid grid-cols-10 gap-0.5 rounded-lg border bg-white p-2 dark:border-gray-800 dark:bg-gray-800">
          {squares.map((number) => {
            const isSnakeStart = number in snakes;
            const isLadderStart = number in ladders;
            const isSnakeEnd = Object.values(snakes).includes(number);
            const isLadderEnd = Object.values(ladders).includes(number);
            const playersHere = players.filter((p) => p.position === number);

            return (
              <div
                key={number}
                className={`relative aspect-square flex items-center justify-center border text-sm font-medium
                  ${
                    isSnakeStart
                      ? "bg-red-100 dark:bg-red-900/30"
                      : isLadderStart
                        ? "bg-green-100 dark:bg-green-900/30"
                        : isSnakeEnd
                          ? "bg-red-50 dark:bg-red-900/20"
                          : isLadderEnd
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-gray-50 dark:bg-gray-900/50"
                  }
                  ${
                    number === 100
                      ? "rounded-tr-lg"
                      : number === 91
                        ? "rounded-tl-lg"
                        : number === 1
                          ? "rounded-br-lg"
                          : number === 10
                            ? "rounded-bl-lg"
                            : ""
                  }
                `}
              >
                {number}
                {isSnakeStart && (
                  <span className="absolute -top-1 right-0 text-red-500">
                    🐍
                  </span>
                )}
                {isLadderStart && (
                  <span className="absolute -top-1 right-0 text-green-500">
                    🪜
                  </span>
                )}
                {playersHere.length > 0 && (
                  <div className="absolute bottom-0 left-0 flex">
                    {playersHere.map((player) => (
                      <span key={player.id}>{player.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="absolute left-0 top-0 h-full w-full"
        />
      </div>

      <div className="text-center">
        <h2
          className={`mb-2 text-lg font-bold ${currentPlayer === 2 ? "text-blue-600 dark:text-blue-400" : ""}`}
        >
          Player 2 {isPlayer2 ? "(You)" : ""}{" "}
          {currentPlayer === 2 ? "(Turn)" : ""}
        </h2>
        <div className="flex gap-2">
          <Dice
            number={number}
            disabled={!isPlayer2 || currentPlayer !== 2 || isRolling || gameWon}
            onClick={() => {
              setIsRolling(true);
              ws?.send(
                JSON.stringify({
                  type: "ROLL_DICE",
                  userId,
                  gameId,
                })
              );
              setTimeout(() => setIsRolling(false), 1000);
            }}
          />
        </div>
      </div>

      <div className={`${gameWon ? "fixed" : "hidden"} inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm`}>
        {gameWon && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Player {currentPlayer === 1 ? 2 : 1} Wins! 🎉
            </h2>
            <button
              onClick={() => router.push("/home")}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
