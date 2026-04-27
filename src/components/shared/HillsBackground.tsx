export default function HillsBackground() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 pointer-events-none"
      style={{ height: 200, zIndex: -1 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 390 200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <path
          d="M0 140 Q80 80 160 120 Q240 160 320 100 Q360 80 390 90 L390 200 L0 200Z"
          fill="#eeeef8"
        />
        <path
          d="M0 160 Q60 130 120 150 Q200 175 280 140 Q330 120 390 130 L390 200 L0 200Z"
          fill="#e4e3f5"
        />
      </svg>

      <svg
        viewBox="0 0 390 200"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <path
          d="M60 185 Q120 160 180 155 Q240 150 290 130 Q320 118 345 110"
          stroke="#b0aee8"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
          fill="none"
        />
        <line
          x1="345"
          y1="110"
          x2="345"
          y2="82"
          stroke="#635bff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M345 82 L362 88 L345 94Z" fill="#635bff" />
      </svg>
    </div>
  );
}
