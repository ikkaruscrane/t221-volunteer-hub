export function TroopLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      aria-label="Troop 221 Logo"
    >
      {/* Compass star points - light gray */}
      <g fill="#E5E5E5" stroke="#D4D4D4" strokeWidth="1">
        {/* Top point */}
        <polygon points="100,5 90,45 110,45" />
        {/* Bottom point */}
        <polygon points="100,155 90,115 110,115" />
        {/* Left point */}
        <polygon points="15,80 55,70 55,90" />
        {/* Right point */}
        <polygon points="185,80 145,70 145,90" />
        {/* Top-left diagonal */}
        <polygon points="35,25 55,55 70,40" />
        {/* Top-right diagonal */}
        <polygon points="165,25 145,55 130,40" />
        {/* Bottom-left diagonal */}
        <polygon points="35,135 55,105 70,120" />
        {/* Bottom-right diagonal */}
        <polygon points="165,135 145,105 130,120" />
      </g>
      
      {/* Oval background - white fill with red stroke */}
      <ellipse
        cx="100"
        cy="80"
        rx="70"
        ry="50"
        fill="white"
        stroke="#BF0000"
        strokeWidth="3"
      />
      
      {/* TROOP text - red */}
      <text
        x="100"
        y="68"
        textAnchor="middle"
        fill="#BF0000"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="24"
        letterSpacing="2"
      >
        TROOP
      </text>
      
      {/* 221 text - red, larger */}
      <text
        x="100"
        y="105"
        textAnchor="middle"
        fill="#BF0000"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="40"
        letterSpacing="1"
      >
        221
      </text>
    </svg>
  )
}
