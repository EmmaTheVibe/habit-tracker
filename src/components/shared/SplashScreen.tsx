export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-indigo-600 text-white"
    >
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-4xl font-bold tracking-tight">Habit Tracker</h1>
        <p className="mt-3 text-indigo-200 text-sm">
          Building better days, one habit at a time.
        </p>
      </div>
    </div>
  );
}
