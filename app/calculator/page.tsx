"use client";

import { useState } from "react";

export default function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = (operator: string) => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) return;

    switch (operator) {
      case "+":
        setResult(n1 + n2);
        break;
      case "-":
        setResult(n1 - n2);
        break;
      case "*":
        setResult(n1 * n2);
        break;
      case "/":
        setResult(n1 / n2);
        break;
      default:
        setResult(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Calculator</h1>
      <div className="space-y-4">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="First number"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Second number"
        />
        <div className="grid grid-cols-4 gap-2">
          {["+", "-", "*", "/"].map((op) => (
            <button
              key={op}
              onClick={() => calculate(op)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {op}
            </button>
          ))}
        </div>
        {result !== null && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-center">Result: {result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
