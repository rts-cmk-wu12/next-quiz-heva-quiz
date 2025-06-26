'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '../context/QuizContext';



export default function ResultPage() {
  const router = useRouter();
  const { score, questions, highScore, resetQuiz } = useQuiz();

  const handleRestart = () => {
    resetQuiz();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6 space-y-6">
      <h1 className="text-4xl font-bold text-yellow-800">🎉 Your Result 🎉</h1>

      <p className="text-lg text-gray-700">
        You answered{' '}
        <span className="font-bold text-green-700">{score}</span> out of{' '}
        <span className="font-bold text-green-700">{questions.length}</span> questions correctly.
      </p>

      <p className="text-md text-gray-600">
        Your highest score: <span className="font-bold text-purple-700">{highScore}</span>
      </p>

      <button
        onClick={handleRestart}
        className="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition"
      >
        Start New Quiz 🔄
      </button>
    </div>
  );
}
