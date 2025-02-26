import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Dice = ({
  onClick,
  disabled,
  number,
}: {
  onClick: () => void;
  disabled: boolean;
  number: number;
}) => {
  const [rolling, setRolling] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <motion.div
        onClick={onClick}
        className={`
          relative w-32 h-32 cursor-pointer
          bg-white rounded-2xl
          shadow-lg hover:shadow-xl
          transition-shadow duration-300
          flex items-center justify-center
          ${rolling ? "cursor-not-allowed" : "cursor-pointer"}
        `}
        whileHover={!rolling ? { scale: 1.05 } : {}}
        whileTap={!rolling ? { scale: 0.95 } : {}}
        animate={
          rolling
            ? {
                rotate: [0, 360, 720, 1080],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          duration: rolling ? 2 : 0.2,
          ease: "easeInOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={number}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-4xl font-bold text-slate-800"
          >
            {number}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <button disabled={disabled}>
        <motion.p
          className="mt-8 text-lg text-slate-600 disabled:cursor-not-allowed"
          animate={{ opacity: rolling ? 0.5 : 1 }}
        >
          {rolling ? "Rolling..." : "Tap to roll"}
        </motion.p>
      </button>
    </div>
  );
};
export default Dice;
