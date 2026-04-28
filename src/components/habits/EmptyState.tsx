"use client";

export default function EmptyState() {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <style>{`
        @keyframes float-empty {
          0%, 100% { transform: translate(var(--tx), var(--ty)) translateY(0px); }
          50% { transform: translate(var(--tx), var(--ty)) translateY(-6px); }
        }
        @keyframes float-empty-reverse {
          0%, 100% { transform: translate(var(--tx), var(--ty)) translateY(0px); }
          50% { transform: translate(var(--tx), var(--ty)) translateY(6px); }
        }
        @keyframes sparkle-empty {
          0%, 100% { opacity: 0.4; transform: translate(var(--tx), var(--ty)) scale(0.8); }
          50% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1.2); }
        }
      `}</style>

      <div
        className="relative flex items-center justify-center"
        style={{ width: 260, height: 260 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(99,91,255,0.08)",
          }}
        />

        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -52%)",
          }}
        >
          <svg
            width="140"
            height="160"
            viewBox="0 0 140 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="52" y="0" width="36" height="22" rx="8" fill="#8b87e8" />
            <circle cx="70" cy="11" r="5" fill="#f8f8fc" />
            <rect
              x="16"
              y="12"
              width="108"
              height="136"
              rx="12"
              fill="#e8e6fa"
              stroke="#c4c0f8"
              strokeWidth="1.5"
            />
            <circle cx="36" cy="58" r="5" fill="#c4c0f8" />
            <rect x="48" y="54" width="56" height="8" rx="4" fill="#c4c0f8" />
            <circle cx="36" cy="82" r="5" fill="#c4c0f8" />
            <rect x="48" y="78" width="48" height="8" rx="4" fill="#c4c0f8" />
            <circle cx="36" cy="106" r="5" fill="#c4c0f8" />
            <rect x="48" y="102" width="52" height="8" rx="4" fill="#c4c0f8" />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "-108px",
              "--ty": "20px",
              transform: "translate(-108px, 20px)",
              animation: "float-empty 3.5s ease-in-out infinite",
            } as React.CSSProperties
          }
        >
          <svg width="32" height="38" viewBox="0 0 32 38" fill="none">
            <path
              d="M16 2C16 2 4 16 4 24a12 12 0 0024 0c0-8-12-22-12-22z"
              stroke="#c4c0f8"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="rgba(196,192,248,0.2)"
            />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "78px",
              "--ty": "24px",
              transform: "translate(78px, 24px)",
              animation: "float-empty-reverse 3s ease-in-out infinite",
            } as React.CSSProperties
          }
        >
          <svg width="34" height="32" viewBox="0 0 34 32" fill="none">
            <path
              d="M17 28S3 20 3 11a8 8 0 0114 0 8 8 0 0114 0c0 9-14 17-14 17z"
              stroke="#c4c0f8"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="rgba(196,192,248,0.2)"
            />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "-92px",
              "--ty": "-68px",
              transform: "translate(-92px, -68px)",
              animation: "sparkle-empty 2.5s ease-in-out infinite",
            } as React.CSSProperties
          }
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0v20M0 10h20"
              stroke="#8b87e8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M3 3l14 14M17 3L3 17"
              stroke="#8b87e8"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "82px",
              "--ty": "-44px",
              transform: "translate(82px, -44px)",
              animation: "sparkle-empty 3s ease-in-out infinite",
              animationDelay: "0.8s",
            } as React.CSSProperties
          }
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 0v16M0 8h16"
              stroke="#8b87e8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "76px",
              "--ty": "-80px",
              transform: "translate(76px, -80px)",
              animation: "sparkle-empty 2s ease-in-out infinite",
              animationDelay: "0.4s",
            } as React.CSSProperties
          }
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle
              cx="5"
              cy="5"
              r="4"
              stroke="#c4c0f8"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "-68px",
              "--ty": "-88px",
              transform: "translate(-68px, -88px)",
              animation: "sparkle-empty 2.8s ease-in-out infinite",
              animationDelay: "1s",
            } as React.CSSProperties
          }
        >
          <svg width="6" height="6" viewBox="0 0 6 6">
            <circle cx="3" cy="3" r="2.5" fill="#c4c0f8" />
          </svg>
        </div>

        <div
          className="absolute"
          style={
            {
              top: "50%",
              left: "50%",
              "--tx": "96px",
              "--ty": "8px",
              transform: "translate(96px, 8px)",
              animation: "sparkle-empty 3.2s ease-in-out infinite",
              animationDelay: "0.6s",
            } as React.CSSProperties
          }
        >
          <svg width="5" height="5" viewBox="0 0 5 5">
            <circle cx="2.5" cy="2.5" r="2" fill="#c4c0f8" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-2 text-indigo-700">No habits yet</h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "#9896b8" }}>
        Start by adding a habit and
        <br />
        take the first step.
      </p>
    </div>
  );
}
