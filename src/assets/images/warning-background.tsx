interface WarningBackgroundProps {
  color?: string
}

export default function WarningBackground({ color }: WarningBackgroundProps) {
  return (
    <svg className="w-full h-full" viewBox="0 0 624 76" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect x="416.016" y="93.8755" width="12" height="230.671" rx="6" transform="rotate(-101.339 416.016 93.8755)" fill={color} fillOpacity="0.15" />
      <rect x="-8.71094" y="37.9039" width="12" height="230.671" rx="6" transform="rotate(-101.028 -8.71094 37.9039)" fill={color} fillOpacity="0.15" />
      <rect x="425" y="150.486" width="12" height="257.313" rx="6" transform="rotate(133.86 425 150.486)" fill={color} fillOpacity="0.05" />
    </svg>
  )
}
