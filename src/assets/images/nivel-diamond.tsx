interface NivelDiamondProps {
  nivel: "silver" | "gold" | "zhelix" | "lymnia" | "valeon";
}
export function NivelDiamond({ nivel }: NivelDiamondProps) {
  const nivelColors = {
    silver: {
      fill: "#9ED5FF",
      stroke: "#0077FF",
    },
    gold: {
      fill: "#FAF25C",
      stroke: "#FFDD00",
    },
    zhelix: {
      fill: "#4F4F4F",
      stroke: "#A1A1A1",
    },
    lymnia: {
      fill: "#4F4F4F",
      stroke: "#A1A1A1",
    },
    valeon: {
      fill: "#4F4F4F",
      stroke: "#A1A1A1",
    },
  };

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_188_17896)">
        <path
          d="M3.72382 2.36621H11.0065L11.9169 5.5524L7.36517 14.2006L2.81348 5.5524L3.72382 2.36621Z"
          fill={nivelColors[nivel].fill}
          stroke={nivelColors[nivel].stroke}
          strokeWidth="0.45517"
        />
        <path
          d="M7.35536 3.36353L5.08984 5.55205L6.58495 11.5304L7.35536 12.6762L8.08626 11.5304L9.64154 5.55205L7.35536 3.36353Z"
          fill={nivelColors[nivel].stroke}
        />
      </g>
      <defs>
        <clipPath id="clip0_188_17896">
          <rect
            width="14.5654"
            height="14.5654"
            fill="white"
            transform="translate(0.0820312 0.0900879)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
