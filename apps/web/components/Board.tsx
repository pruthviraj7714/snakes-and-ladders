"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Dice from "./Dice";
import { useSession } from "next-auth/react";

type PlayerType = {
  id: 1 | 2;
  position: number;
  emoji: string;
};

export default function Board({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [diceValue1, setDiceValue1] = useState(1);
  const [diceValue2, setDiceValue2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const { ws, wsError } = useSocket();
  const { data: session } = useSession();
  //@ts-ignore
  const userId = session?.user.id;

  const squares = Array.from({ length: 100 }, (_, i) => 100 - i);

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

  const rollDice = () => {
    if (isRolling || gameWon) return;

    setIsRolling(true);
    const rollDuration = 1000;

    const startTime = Date.now();
    const rollAnimation = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < rollDuration) {
        setDiceValue1(Math.floor(Math.random() * 6) + 1);
        setDiceValue2(Math.floor(Math.random() * 6) + 1);
        requestAnimationFrame(rollAnimation);
      } else {
        const finalValue1 = Math.floor(Math.random() * 6) + 1;
        const finalValue2 = Math.floor(Math.random() * 6) + 1;
        setDiceValue1(finalValue1);
        setDiceValue2(finalValue2);
        movePlayer(finalValue1 + finalValue2);
        setIsRolling(false);
      }
    };

    requestAnimationFrame(rollAnimation);
  };

  const movePlayer = (spaces: number) => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (player.id === currentPlayer) {
          let newPosition = player.position + spaces;

          // Check if player won
          if (newPosition >= 100) {
            setGameWon(true);
            newPosition = 100;
          }

          // Check for snakes
          if (newPosition in snakes) {
            newPosition = snakes[newPosition as keyof typeof snakes];
          }

          // Check for ladders
          if (newPosition in ladders) {
            newPosition = ladders[newPosition as keyof typeof ladders];
          }

          return { ...player, position: newPosition };
        }
        return player;
      });
    });

    // Switch players if game not won
    if (!gameWon) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  useEffect(() => {
    if (!ws) return;

    ws.send(
      JSON.stringify({
        type: "JOIN_GAME",
        gameId,
        userId,
      })
    );

    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      console.log(msg);
      
      switch (msg.type) {
        case "ROOM_JOINED":
          if (players.length == 0) {
            setPlayers((prev) => [...prev, {
              id: userId,
              position: Number(msg.player1Position),
              emoji: "😄",
            }])
            setCurrentPlayer(1);
          } else if (players.length == 1) {
            setPlayers((prev) => [...prev, {
              id: userId,
              position: Number(msg.player2Position),
              emoji: "😄",
            }])
            setCurrentPlayer(2);
          }
          break;
        case "ROOM_LEFT":
          if (players.some(p => p.id === msg.userId)) {
            setPlayers((prev) => prev.filter((p) => p.id !== msg.userId));
          }
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
  }, [ws]);

  // Draw snakes and ladders on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate square size
    const squareSize = canvas.width / 10;

    // Helper function to get x,y coordinates for a number
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

    // Draw snakes
    Object.entries(snakes).forEach(([from, to]) => {
      const start = getCoordinates(Number(from));
      const end = getCoordinates(Number(to));

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);

      // Create curve for snake
      const cp1x = start.x;
      const cp1y = (start.y + end.y) / 2;
      const cp2x = end.x;
      const cp2y = (start.y + end.y) / 2;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // Draw ladders
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
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-100 p-4 dark:bg-gray-900">
      {/* Player 1's dice */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <h2 className={`mb-2 text-lg font-bold`}>
            Player 1 {currentPlayer === 1 ? "(Your Turn)" : ""}
          </h2>
          <div className="flex gap-2">
            <Dice />
            <Dice />
          </div>
        </div>
      </div>

      {/* Game board */}
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

      {/* Game controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={rollDice}
          disabled={isRolling || gameWon}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </button>
        {gameWon && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Player {currentPlayer === 1 ? 2 : 1} Wins! 🎉
            </h2>
            <button
              onClick={() => {
                setPlayers([
                  { id: 1, position: 1, emoji: "👨" },
                  { id: 2, position: 1, emoji: "👩" },
                ]);
                setGameWon(false);
                setCurrentPlayer(1);
              }}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
