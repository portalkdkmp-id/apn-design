export function AuroraBackground() {
  return (
    <div className="aurora-field">
      {/* soft diffused color wash behind the ribbons */}
      <div className="aurora-wash aurora-wash-a" />
      <div className="aurora-wash aurora-wash-b" />

      <svg
        className="aurora-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aurora-grad-top" x1="0%" y1="0%" x2="100%" y2="60%">
            <stop offset="0%" style={{ stopColor: 'var(--aurora-gold)', stopOpacity: 0.9 }} />
            <stop offset="50%" style={{ stopColor: 'var(--aurora-pink)', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: 'var(--aurora-red)', stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="aurora-grad-bottom" x1="0%" y1="100%" x2="100%" y2="40%">
            <stop offset="0%" style={{ stopColor: 'var(--aurora-red)', stopOpacity: 0.9 }} />
            <stop offset="55%" style={{ stopColor: 'var(--aurora-pink)', stopOpacity: 0.75 }} />
            <stop offset="100%" style={{ stopColor: 'var(--aurora-gold)', stopOpacity: 0 }} />
          </linearGradient>
          <filter id="aurora-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="aurora-glow-soft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* top-left ribbon */}
        <g className="aurora-ribbon aurora-ribbon-tl">
          <path
            d="M -80 260 C 120 60 260 340 480 200 C 640 100 760 260 960 140"
            stroke="url(#aurora-grad-top)"
            strokeWidth="52"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow)"
            opacity="0.6"
          />
          <path
            d="M -80 260 C 120 60 260 340 480 200 C 640 100 760 260 960 140"
            stroke="url(#aurora-grad-top)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow-soft)"
            opacity="0.95"
          />
        </g>

        {/* top-right ribbon */}
        <g className="aurora-ribbon aurora-ribbon-tr">
          <path
            d="M 1520 260 C 1320 60 1180 340 960 200 C 800 100 680 260 480 140"
            stroke="url(#aurora-grad-top)"
            strokeWidth="48"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow)"
            opacity="0.55"
          />
          <path
            d="M 1520 260 C 1320 60 1180 340 960 200 C 800 100 680 260 480 140"
            stroke="url(#aurora-grad-top)"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow-soft)"
            opacity="0.9"
          />
        </g>

        {/* bottom-left ribbon */}
        <g className="aurora-ribbon aurora-ribbon-bl">
          <path
            d="M -80 640 C 120 840 260 560 480 700 C 640 800 760 640 960 760"
            stroke="url(#aurora-grad-bottom)"
            strokeWidth="56"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow)"
            opacity="0.6"
          />
          <path
            d="M -80 640 C 120 840 260 560 480 700 C 640 800 760 640 960 760"
            stroke="url(#aurora-grad-bottom)"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow-soft)"
            opacity="0.95"
          />
        </g>

        {/* bottom-right ribbon */}
        <g className="aurora-ribbon aurora-ribbon-br">
          <path
            d="M 1520 640 C 1320 840 1180 560 960 700 C 800 800 680 640 480 760"
            stroke="url(#aurora-grad-bottom)"
            strokeWidth="50"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow)"
            opacity="0.55"
          />
          <path
            d="M 1520 640 C 1320 840 1180 560 960 700 C 800 800 680 640 480 760"
            stroke="url(#aurora-grad-bottom)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            filter="url(#aurora-glow-soft)"
            opacity="0.9"
          />
        </g>

        {/* sparkles */}
        <g className="aurora-stars">
          {[
            [180, 190], [1260, 150], [340, 610], [1120, 660],
            [620, 90], [90, 520], [1350, 480], [760, 780],
            [980, 320], [420, 380],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 3 : 2}
              fill="var(--aurora-sparkle)"
              filter="url(#aurora-glow-soft)"
              className="aurora-star"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}