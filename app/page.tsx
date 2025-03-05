export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">
        Welcome to My App
      </h1>
      <div className="flex gap-4 mb-4 sm:mb-8">
        <a
          href="/invader-game"
          className="bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg sm:text-xl hover:bg-gray-200 transition-colors active:scale-95"
        >
          Play Invader Game
        </a>
        <a
          href="/calculator"
          className="bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg sm:text-xl hover:bg-gray-200 transition-colors active:scale-95"
        >
          Calculator
        </a>
        <a
          href="/random-number"
          className="bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg sm:text-xl hover:bg-gray-200 transition-colors active:scale-95"
        >
          Random Number
        </a>
      </div>

      {/* Mobile notice */}
      <div className="mt-8 text-center text-gray-400 text-sm sm:hidden">
        <p>スマホでプレイする場合：</p>
        <p>画面を横向きにするとより快適にプレイできます</p>
      </div>
    </div>
  );
}
