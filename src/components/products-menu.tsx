import { ReactNode, useRef, useLayoutEffect, useState } from 'react'
import ZProductWidget from '@/assets/images/z-product.svg'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProductsMenuProps {
  items: {
    label: string
    icon: ReactNode
    value: string
  }[]
  active: string
  onChange: (value: string) => void
}

export function ProductsMenu({ items, active, onChange }: ProductsMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorX, setIndicatorX] = useState(0)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const idx = items.findIndex((item) => item.value === active)
    const btn = containerRef.current.querySelectorAll('button')[idx] as HTMLElement
    if (btn) {
      setIndicatorX(btn.offsetLeft + btn.offsetWidth / 2 - 12) // centraliza, 18 = metade do ícone (36px)
    }
  }, [active, items])

  return (
    <div className="relative">
      {/* Indicador animado */}
      <motion.div
        className="absolute -top-7 mt-6 z-10"
        animate={{ x: indicatorX }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ left: 0 }}
      >
        <Image
          src={ZProductWidget}
          alt="Z Product Widget"
          width={24}
          height={12}
        />
      </motion.div>
      <nav
        ref={containerRef}
        className="flex border-t border-neutral-100 px-2 py-4 gap-2"
      >
        {items.map((item) => {
          const isActive = item.value === active
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium font-araboto text-base transition-all leading-normal flex-shrink-0
                ${isActive
                  ? 'bg-zhex-base-500/10 text-zhex-base-500'
                  : 'text-neutral-600 hover:text-zhex-base-500'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
