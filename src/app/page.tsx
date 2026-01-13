'use client';

import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    if (!code) return;
    setLoading(true);
    setRoast('');

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setRoast(data.roast);
    } catch (error) {
      setRoast("Error: The AI refused to look at this code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-gray-200 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 text-center">
          Roast My Code 🔥
        </h1>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your spaghetti code here..."
          className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-red-500 outline-none"
        />

        <button
          onClick={handleRoast}
          disabled={loading}
          className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-white transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing the mess..." : "Destroy Me 🚀"}
        </button>

        {roast && (
          <div className="bg-gray-800 p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/10">
            <h3 className="text-xl font-bold text-red-400 mb-2">Verdict:</h3>
            <p className="font-mono whitespace-pre-wrap">{roast}</p>
          </div>
        )}
      </div>
    </main>
  );
}