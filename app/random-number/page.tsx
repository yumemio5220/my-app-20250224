"use client";

import { useState } from "react";

export default function RandomNumberPage() {
  const [numbers, setNumbers] = useState<number[]>([]);

  const generateNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    setNumbers([randomNumber, ...numbers]);
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <div className="flex flex-col items-center pt-8">
        <h1 className="text-2xl font-bold mb-8">Random Number Generator</h1>
        <button
          onClick={generateNumber}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
        >
          Generate Number
        </button>
      </div>

      <div className="w-full max-w-md overflow-y-auto flex-1 pb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Number</h2>
        {numbers.length > 0 && (
          <div className="text-3xl font-bold text-center mb-8">
            {numbers[0]}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">History</h2>
        <ul className="space-y-2">
          {numbers.map((number, index) => (
            <li key={index} className="text-lg">
              {number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
