import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Dice = () => {
  const [rolling, setRolling] = useState(false);
  const [number, setNumber] = useState(1);
  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    const duration = 2000; // 2 seconds of rolling animation
    const rolls = 10; // Number of interim rolls
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setNumber(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= rolls) {
        clearInterval(rollInterval);
        setRolling(false);
      }
    }, duration / rolls);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <motion.div
        onClick={rollDice}
        className={`
          relative w-32 h-32 cursor-pointer
          bg-white rounded-2xl
          shadow-lg hover:shadow-xl
          transition-shadow duration-300
          flex items-center justify-center
          ${rolling ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={!rolling ? { scale: 1.05 } : {}}
        whileTap={!rolling ? { scale: 0.95 } : {}}
        animate={rolling ? {
          rotate: [0, 360, 720, 1080],
          scale: [1, 1.1, 1],
        } : {}}
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
      
      <motion.p
        className="mt-8 text-lg text-slate-600"
        animate={{ opacity: rolling ? 0.5 : 1 }}
      >
        {rolling ? "Rolling..." : "Tap to roll"}
      </motion.p>
    </div>
  );
};
export default Dice;