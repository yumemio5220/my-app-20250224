export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">
        Welcome to My App
      </h1>
      <a
        href="/invader-game"
        className="bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg sm:text-xl hover:bg-gray-200 transition-colors active:scale-95"
      >
        Play Invader Game
      </a>

      {/* Mobile notice */}
      <div className="mt-8 text-center text-gray-400 text-sm sm:hidden">
        <p>スマホでプレイする場合：</p>
        <p>画面を横向きにするとより快適にプレイできます</p>
      </div>
    </div>
  );
}
