export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#f8f8fc" }}
    >
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes pulse-ring-slow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes float-icon {
          0%, 100% { transform: translate(var(--tx), var(--ty)) translateY(0px); }
          50% { transform: translate(var(--tx), var(--ty)) translateY(-5px); }
        }
        @keyframes float-icon-reverse {
          0%, 100% { transform: translate(var(--tx), var(--ty)) translateY(0px); }
          50% { transform: translate(var(--tx), var(--ty)) translateY(5px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.4; transform: translate(var(--tx), var(--ty)) scale(0.8); }
          50% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1.2); }
        }
      `}</style>

      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-8 px-8"
        style={{ top: "50%", transform: "translateY(-60%)" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ width: 208, height: 208 }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(99,91,255,0.12) 0%, rgba(99,91,255,0.04) 60%, transparent 100%)",
              animation: "pulse-ring-slow .6s ease-in-out infinite",
            }}
          />

          <div
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(99,91,255,0.08)",
              animation: "pulse-ring .5s ease-in-out infinite",
            }}
          />

          <div
            className="absolute flex items-center justify-center rounded-2xl"
            style={{
              width: 72,
              height: 72,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(135deg, #635bff 0%, #4f46e5 100%)",
              boxShadow: "0 8px 32px rgba(99,91,255,0.35)",
              zIndex: 10,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M8 18.5L14.5 25L28 11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            className="absolute"
            style={
              {
                top: "50%",
                left: "50%",
                "--tx": "-90px",
                "--ty": "-80px",
                transform: "translate(-90px, -80px)",
                animation: "float-icon .6s ease-in-out infinite",
              } as React.CSSProperties
            }
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="3"
                stroke="#c4c0f8"
                strokeWidth="1.5"
              />
              <path d="M3 9h18" stroke="#c4c0f8" strokeWidth="1.5" />
              <path
                d="M8 2v4M16 2v4"
                stroke="#c4c0f8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect x="7" y="13" width="3" height="3" rx="0.5" fill="#c4c0f8" />
            </svg>
          </div>

          <div
            className="absolute"
            style={
              {
                top: "50%",
                left: "50%",
                "--tx": "60px",
                "--ty": "-80px",
                transform: "translate(60px, -80px)",
                animation: "float-icon-reverse .7s ease-in-out infinite",
              } as React.CSSProperties
            }
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="12" width="4" height="9" rx="1" fill="#c4c0f8" />
              <rect x="10" y="7" width="4" height="14" rx="1" fill="#c4c0f8" />
              <rect x="17" y="4" width="4" height="17" rx="1" fill="#c4c0f8" />
            </svg>
          </div>

          <div
            className="absolute"
            style={
              {
                top: "50%",
                left: "50%",
                "--tx": "-90px",
                "--ty": "50px",
                transform: "translate(-90px, 50px)",
                animation: "float-icon .8s ease-in-out infinite",
                animationDelay: "0.2s",
              } as React.CSSProperties
            }
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C10 2 4 9 4 13a6 6 0 0012 0c0-4-6-11-6-11z"
                stroke="#c4c0f8"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            className="absolute"
            style={
              {
                top: "50%",
                left: "50%",
                "--tx": "60px",
                "--ty": "50px",
                transform: "translate(60px, 50px)",
                animation: "float-icon-reverse .45s ease-in-out infinite",
                animationDelay: "0.2s",
              } as React.CSSProperties
            }
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 18s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z"
                stroke="#c4c0f8"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            className="absolute"
            style={
              {
                top: "50%",
                left: "50%",
                "--tx": "44px",
                "--ty": "-44px",
                transform: "translate(44px, -44px)",
                animation: "sparkle .4s ease-in-out infinite",
                animationDelay: "0.2s",
              } as React.CSSProperties
            }
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d="M5 0v10M0 5h10"
                stroke="#c4c0f8"
                strokeWidth="1.2"
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
                "--tx": "-52px",
                "--ty": "36px",
                transform: "translate(-52px, 36px)",
                animation: "sparkle .45s ease-in-out infinite",
                animationDelay: ".2s",
              } as React.CSSProperties
            }
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d="M5 0v10M0 5h10"
                stroke="#d4d0fa"
                strokeWidth="1.2"
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
                "--tx": "-52px",
                "--ty": "-44px",
                transform: "translate(-52px, -44px)",
                animation: "sparkle .5s ease-in-out infinite",
                animationDelay: "0.2s",
              } as React.CSSProperties
            }
          >
            <svg width="6" height="6" viewBox="0 0 6 6">
              <circle cx="3" cy="3" r="2" fill="#c4c0f8" />
            </svg>
          </div>

          <div
            className="absolute"
            style={
              {
                top: "50%",
                left: "50%",
                "--tx": "46px",
                "--ty": "38px",
                transform: "translate(46px, 38px)",
                animation: "sparkle .4s ease-in-out infinite",
                animationDelay: ".2s",
              } as React.CSSProperties
            }
          >
            <svg width="5" height="5" viewBox="0 0 5 5">
              <circle cx="2.5" cy="2.5" r="1.5" fill="#c4c0f8" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h1
            className="text-4xl font-black"
            style={{ color: "#1a1a2e", letterSpacing: "-0.02em" }}
          >
            <span style={{ color: "#1a1a2e" }}>Habit </span>
            <span style={{ color: "#635bff" }}>Tracker</span>
          </h1>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "#9896b8" }}
          >
            Small habits, big changes.
            <br />
            Track. Build. Become.
          </p>
        </div>
      </div>
    </div>
  );
}
