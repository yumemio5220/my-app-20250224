export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to My App</h1>
      <a
        href="/invader-game"
        className="bg-white text-black px-6 py-3 rounded-lg text-xl hover:bg-gray-200 transition-colors"
      >
        Play Invader Game
      </a>
    </div>
  );
}
