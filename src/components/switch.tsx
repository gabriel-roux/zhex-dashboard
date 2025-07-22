'use client'

import { motion } from 'framer-motion'

export function Switch({
  active,
  setValue,
}: {
  active: boolean
  setValue: (value: boolean) => void
}) {
  return (
    <motion.button
      type="button"
      aria-label="Ativar afiliado"
      onClick={() => setValue(!active)}
      className="w-8 h-5 rounded-full relative cursor-pointer outline-none flex-shrink-0"
      initial={false}
      animate={{
        backgroundColor: active
          ? '#10B981'
          : '#D1D5DB', // green-secondary-500 : neutral-300
      }}
      transition={{
        type: 'spring',
        stiffness: 700,
        damping: 30,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-3 h-3 bg-white rounded-full absolute top-1 shadow-sm"
        initial={false}
        animate={{
          x: active
            ? 16
            : 4, // right-1 (16px) : left-1 (4px)
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      />
    </motion.button>
  )
}
