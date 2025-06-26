'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/quiz/1?category=${category}&difficulty=${difficulty}&amount=${amount}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start overflow-y-auto bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      <h1 className="text-5xl font-extrabold mb-4 text-blue-900">🎉 Quiz App 🎉</h1>
    <p className="text-center text-lg text-gray-700 mb-6 leading-relaxed max-w-xl">
  Ready to challenge your mind? Choose a category, pick the difficulty level, and decide how many questions you want. Let the fun begin and see how much you really know! 🎯
</p>



      <form
        onSubmit={handleSubmit}
        className="mt-6 md:mt-12 bg-white p-8 rounded-xl shadow-lg space-y-6 w-full max-w-md"
      >
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="9">General Knowledge</option>
            <option value="21">Sports</option>
            <option value="23">History</option>
            <option value="11">Movies</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Number of Questions:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Quiz 🚀
        </button>
      </form>
    </div>
  );
}
