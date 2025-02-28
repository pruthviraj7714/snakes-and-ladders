"use client"

import { motion, AnimatePresence } from "framer-motion"

const diceFaces = {
  1: [{ x: 50, y: 50 }],
  2: [
    { x: 25, y: 25 },
    { x: 75, y: 75 },
  ],
  3: [
    { x: 25, y: 25 },
    { x: 50, y: 50 },
    { x: 75, y: 75 },
  ],
  4: [
    { x: 25, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 25 },
    { x: 75, y: 75 },
  ],
  5: [
    { x: 25, y: 25 },
    { x: 25, y: 75 },
    { x: 50, y: 50 },
    { x: 75, y: 25 },
    { x: 75, y: 75 },
  ],
  6: [
    { x: 25, y: 25 },
    { x: 25, y: 50 },
    { x: 25, y: 75 },
    { x: 75, y: 25 },
    { x: 75, y: 50 },
    { x: 75, y: 75 },
  ],
}

const Dice = ({
  rolling,
  onClick,
  disabled,
  number,
}: {
  rolling: boolean
  onClick: () => void
  disabled: boolean
  number: number
}) => {
  const safeNumber = Math.min(Math.max(1, number), 6)
  const dots = diceFaces[safeNumber as keyof typeof diceFaces] || diceFaces[1]

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-4 sm:p-8">
      <motion.div
        onClick={!disabled && !rolling ? onClick : undefined}
        className={`
          relative w-24 h-24 sm:w-32 sm:h-32 
          bg-white rounded-xl
          border border-slate-200
          shadow-lg 
          ${!disabled && !rolling ? "hover:shadow-xl cursor-pointer" : "opacity-90"}
          transition-all duration-300
        `}
        whileHover={!disabled && !rolling ? { scale: 1.05, rotate: 5 } : {}}
        whileTap={!disabled && !rolling ? { scale: 0.95 } : {}}
        animate={
          rolling
            ? {
                rotate: [0, 90, 180, 270, 360, 450, 540, 630, 720],
                y: [0, -20, 0, -15, 0, -10, 0],
                scale: [1, 1.1, 1, 1.05, 1, 1.02, 1],
                borderRadius: ["10%", "15%", "10%"],
              }
            : {}
        }
        transition={{
          duration: rolling ? 1.5 : 0.2,
          ease: rolling ? "easeInOut" : "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={safeNumber}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            {dots.map((dot, index) => (
              <motion.div
                key={index}
                className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-slate-800 rounded-full"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.2 }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.button
        onClick={!disabled && !rolling ? onClick : undefined}
        disabled={disabled || rolling}
        className={`
          mt-8 px-6 py-2 rounded-full 
          bg-gradient-to-r from-indigo-500 to-purple-600
          text-white font-medium
          shadow-md hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50
          transition-all duration-300
          ${disabled || rolling ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}
        `}
        whileHover={!disabled && !rolling ? { scale: 1.05 } : {}}
        whileTap={!disabled && !rolling ? { scale: 0.95 } : {}}
        animate={rolling ? { y: [0, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 } } : {}}
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </motion.button>
    </div>
  )
}

export default Dice

