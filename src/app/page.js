'use client'
import { useState } from 'react';

const MOCK_RESPONSES = {
  normal: [
    "🎁 A personalized star map of their birthday night sky - because they're stellar (even if they don't know it)!",
    "🎁 A custom phone case with their pet's face - because we know who they love more than you"
  ],
  coal: [
    "😈 A book called 'How to Be a Better Sibling' - with all the important parts highlighted",
    "😈 A wall calendar with 'Return Items' marked on every single day. Some people need daily reminders 🙄"
  ]
};

export default function GiftBot() {
  const [useMockData, setUseMockData] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isCoalMode, setIsCoalMode] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    if (useMockData) {
      // Use mock data during development
      setTimeout(() => {
        const responses = isCoalMode ? MOCK_RESPONSES.coal : MOCK_RESPONSES.normal;
        setResult(responses[Math.floor(Math.random() * responses.length)]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          isCoalMode,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setResult('🎅 Ho ho NO! Something went wrong!');
      } else {
        setResult(data.suggestion);
      }
    } catch (error) {
      setResult('🎅 Ho ho NO! Something went wrong!');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-red-100 to-green-100">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center" style={{ fontFamily: 'Comic Sans MS' }}>
          Gift Bot 🎁
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-lg">Who needs a gift?</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Describe the person and occasion..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isCoalMode}
                onChange={(e) => setIsCoalMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Coal Mode 😈</span>
            </label>

            {process.env.NODE_ENV === 'development' && (
              <label className="flex items-center space-x-2 ml-4">
                <input
                  type="checkbox"
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">Use Mock Data</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !prompt}
            className={`w-full p-2 text-white rounded ${
              loading || !prompt ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? '🎄 Thinking...' : '🎁 Get Gift Suggestion'}
          </button>
        </form>

        {result && (
          <div className="p-4 bg-white rounded shadow">
            <p className="text-lg">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}