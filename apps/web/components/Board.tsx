"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Dice from "./Dice";
import { useSession } from "next-auth/react";
import { BiLoader } from "react-icons/bi";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { useRouter } from "next/navigation";
import { GameStateType, PlayerType } from "../types/types";

const generateSquares = () => {
  const result = [];
  for (let row = 9; row >= 0; row--) {
    const isEvenRow = row % 2 === 0;

    for (let col = 0; col < 10; col++) {
      const position = isEvenRow ? row * 10 + col + 1 : row * 10 + 10 - col;

      result.push(position);
    }
  }
  return result;
};

const snakes = {
  99: 45,
  95: 75,
  88: 24,
  62: 19,
  36: 6,
};

const ladders = {
  7: 25,
  13: 31,
  21: 42,
  28: 84,
  37: 63,
  51: 67,
};

const PLAYER_EMOJIS = {
  1: "😎",
  2: "😄",
};

export default function Board({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameWon, setGameWon] = useState(false);
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [roll1, setRoll1] = useState(false);
  const [roll2, setRoll2] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const { ws, wsError } = useSocket();
  const [currentGameState, setCurrentGameState] =
    useState<GameStateType | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  //@ts-ignore
  const userId = session?.user.id;
  const squares = generateSquares();

  const movePlayer = (
    currPlayer: string,
    spaces: number,
    position?: number,
    skipTurnChange: boolean = false
  ) => {
    const player = players.find((p) => p.user.id === currPlayer);

    if (player?.id === 1) {
      setDice1(spaces);
    } else if (player?.id === 2) {
      setDice2(spaces);
    }

    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (player.user.id === currPlayer) {
          if (position !== undefined) {
            return { ...player, position };
          }

          let newPosition = player.position + spaces;

          if (newPosition >= 100) {
            setGameWon(true);
            newPosition = 100;

            if (ws) {
              ws.send(
                JSON.stringify({
                  type: "GAME_WON",
                  gameId,
                  playerId: player.user.id,
                  userId,
                })
              );
            }
          }

          if (newPosition in snakes) {
            ws?.send(
              JSON.stringify({
                type: "SNAKE_ATE",
                userId: currPlayer,
                gameId,
              })
            );
          }

          if (newPosition in ladders) {
            ws?.send(
              JSON.stringify({
                type: "LADDER_FOUND",
                userId: currPlayer,
                gameId,
              })
            );
          }

          return { ...player, position: newPosition };
        }
        return player;
      });
    });

    if (!gameWon && !skipTurnChange) {
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    }
  };

  const fetchInitialGameState = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/game/${gameId}`);
      const game = res.data.game;

      setPlayers([]);

      if (game.player1) {
        setPlayers((prev) => [
          ...prev,
          {
            id: 1,
            user: game.player1,
            position: Number(game.player1Position) || 1,
            emoji: PLAYER_EMOJIS[1],
          },
        ]);
      }

      if (game.player2) {
        setPlayers((prev) => [
          ...prev,
          {
            id: 2,
            user: game.player2,
            position: Number(game.player2Position) || 1,
            emoji: PLAYER_EMOJIS[2],
          },
        ]);
      }

      setCurrentPlayer(game.currentTurn === game.player1 ? 1 : 2);
      setCurrentGameState(game);
    } catch (error: any) {
      console.error("Error fetching game state:", error.message);
      alert("Failed to load game: " + error.message);
    }
  };

  useEffect(() => {
    fetchInitialGameState();
  }, [gameId]);

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
      console.log(msg);

      switch (msg.type) {
        case "PLAYER_JOINED":
          fetchInitialGameState();
          break;

        case "ROOM_LEFT":
          if (players.some((p) => p.user.id === msg.userId)) {
            setPlayers((prev) => prev.filter((p) => p.user.id !== msg.userId));
          }
          setCurrentGameState(msg.game);
          break;

        case "DICE_ROLLED":
          movePlayer(msg.userId, Number(msg.diceRoll));
          setCurrentGameState(msg.game);
          break;

        case "SNAKE_EATEN_OUT":
          movePlayer(
            msg.userId,
            0,
            msg.userId === msg.game.player1
              ? Number(msg.game.player1Position)
              : Number(msg.game.player2Position),
            true
          );
          break;

        case "RISED_ON_LADDER":
          movePlayer(
            msg.userId,
            0,
            msg.userId === msg.game.player1
              ? Number(msg.game.player1Position)
              : Number(msg.game.player2Position),
            true
          );
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const squareSize = canvas.width / 10;

    const getCoordinates = (position: number) => {
      const row = 9 - Math.floor((position - 1) / 10);
      const isEvenRow = (9 - row) % 2 === 0;

      let col;
      if (isEvenRow) {
        col = (position - 1) % 10;
      } else {
        col = 9 - ((position - 1) % 10);
      }

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

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const distance = Math.hypot(start.x - end.x, start.y - end.y);

      const cp1x =
        start.x +
        (midX - start.x) * 0.3 +
        (Math.random() * 0.5 - 0.25) * distance;
      const cp1y = start.y + (midY - start.y) * 0.3;
      const cp2x =
        end.x + (midX - end.x) * 0.3 + (Math.random() * 0.5 - 0.25) * distance;
      const cp2y = end.y + (midY - end.y) * 0.3;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    });

    Object.entries(ladders).forEach(([from, to]) => {
      const start = getCoordinates(Number(from));
      const end = getCoordinates(Number(to));

      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const perpAngle = angle + Math.PI / 2;
      const railDistance = 8;

      ctx.beginPath();
      ctx.moveTo(
        start.x - Math.cos(perpAngle) * railDistance,
        start.y - Math.sin(perpAngle) * railDistance
      );
      ctx.lineTo(
        end.x - Math.cos(perpAngle) * railDistance,
        end.y - Math.sin(perpAngle) * railDistance
      );
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        start.x + Math.cos(perpAngle) * railDistance,
        start.y + Math.sin(perpAngle) * railDistance
      );
      ctx.lineTo(
        end.x + Math.cos(perpAngle) * railDistance,
        end.y + Math.sin(perpAngle) * railDistance
      );
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.stroke();

      const distance = Math.hypot(end.x - start.x, end.y - start.y);
      const steps = Math.floor(distance / 20);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x1 =
          start.x * (1 - t) + end.x * t - Math.cos(perpAngle) * railDistance;
        const y1 =
          start.y * (1 - t) + end.y * t - Math.sin(perpAngle) * railDistance;
        const x2 =
          start.x * (1 - t) + end.x * t + Math.cos(perpAngle) * railDistance;
        const y2 =
          start.y * (1 - t) + end.y * t + Math.sin(perpAngle) * railDistance;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [canvasRef.current?.width, canvasRef.current?.height]);

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

  const isPlayer1 = players[0]?.user.id === userId;
  const isPlayer2 = players[1]?.user.id === userId;

  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-gray-100 p-4 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <h2
            className={`mb-2 text-lg font-bold ${currentPlayer === 1 ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            {players[0]?.user.username} {isPlayer1 ? "(You)" : ""}{" "}
            {currentPlayer === 1 ? "(Turn)" : ""}
          </h2>
          <div className="flex flex-col gap-2">
            <Dice
              rolling={roll1}
              number={dice1}
              disabled={
                currentPlayer === 2 ||
                roll1 ||
                roll2 ||
                userId === currentGameState?.player2
              }
              onClick={() => {
                setRoll1(true);
                ws?.send(
                  JSON.stringify({
                    type: "ROLL_DICE",
                    userId: players[0]?.user.id,
                    gameId,
                  })
                );
                setTimeout(() => setRoll1(false), 1000);
              }}
            />
            {userId === currentGameState?.player1 && (
              <div className="">It's {dice1}</div>
            )}
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
                      <span className="text-xl" key={player.id}>
                        {player.emoji}
                      </span>
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
          {players[1]?.user.username} {isPlayer2 ? "(You)" : ""}{" "}
          {currentPlayer === 2 ? "(Turn)" : ""}
        </h2>

        <div className="flex flex-col">
          <Dice
            rolling={roll2}
            number={dice2}
            disabled={
              currentPlayer === 1 ||
              roll1 ||
              roll2 ||
              userId === currentGameState?.player1
            }
            onClick={() => {
              setRoll2(true);
              ws?.send(
                JSON.stringify({
                  type: "ROLL_DICE",
                  userId: players[1]?.user.id,
                  gameId,
                })
              );
              setTimeout(() => setRoll2(false), 1000);
            }}
          />
          {userId === currentGameState?.player2 && (
            <div className="">It's {dice2}</div>
          )}
        </div>
      </div>

      <div
        className={`${gameWon ? "fixed" : "hidden"} inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm`}
      >
        {gameWon && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Player{" "}
              {currentPlayer === 1
                ? players[1]?.user.username
                : players[0]?.user.username}{" "}
              Wins! 🎉
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
