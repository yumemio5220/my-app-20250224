"use client";

import { useState } from "react";
import Link from "next/link";

function isPrime(num: number): boolean {
  if (num < 2) return false;
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function getNextPrime(current: number): number {
  let next = current + 1;
  while (!isPrime(next)) {
    next++;
  }
  return next;
}

export default function PrimeNumberPage() {
  const [number, setNumber] = useState(1);
  const [history, setHistory] = useState<number[]>([]);

  const handleClick = () => {
    const nextPrime = getNextPrime(number);
    setNumber(nextPrime);
    setHistory((prev) => [nextPrime, ...prev]);
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4">
        ← Back to Home
      </Link>
      <div className="flex flex-col items-center pt-8">
        <h1 className="text-2xl font-bold mb-8">Prime Number</h1>
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
        >
          Next Prime
        </button>
      </div>

      <div className="w-full max-w-md overflow-y-auto flex-1 pb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Prime</h2>
        {history.length > 0 && (
          <div className="text-3xl font-bold text-center mb-8">
            {history[0]}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">History</h2>
        <div className="text-lg break-words">{history.join(" ")}</div>
      </div>
    </div>
  );
}
