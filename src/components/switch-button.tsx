interface SwitchButtonProps {
  items: string[]
  active: string
  onChange: (value: string) => void
}

export function SwitchButton({ items, active, onChange }: SwitchButtonProps) {
  return (
    <div className="inline-flex bg-neutral-50 p-1 rounded-lg">
      {items.map((item) => {
        const isActive = item === active
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`w-[176px] py-2 rounded-lg text-sm font-araboto font-medium transition-colors ${
              isActive
                ? 'bg-white text-neutral-900 shadow border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}
