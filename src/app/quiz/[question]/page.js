'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuiz } from '../../context/QuizContext';

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { questions = [], setQuestions, addScore } = useQuiz();

  const questionNumber = parseInt(params.question, 10);

  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const amount = searchParams.get('amount');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(10);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // 🔁 Funktion til at gå til næste spørgsmål
  const goToNextQuestion = useCallback(() => {
    router.push(`/quiz/${questionNumber + 1}?category=${category}&difficulty=${difficulty}&amount=${amount}`);
  }, [router, questionNumber, category, difficulty, amount]);

  // 📥 Henter spørgsmål fra API når komponenten loader første gang
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
        );
        if (response.status === 429) {
          throw new Error('Too many requests! Please wait a moment...');
        }
        const data = await response.json();
        setQuestions(data.results || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (questions.length === 0 && !loading) {
      fetchQuestions();
    }
  }, [amount, category, difficulty, setQuestions, questions.length, loading]);

  // ⏳ Starter en 10 sekunders timer for hvert spørgsmål
  useEffect(() => {
    if (loading || showFeedback) return;

    setTimer(10);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          goToNextQuestion();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, showFeedback, questionNumber, goToNextQuestion]);

  // ✅ Sender brugeren videre til resultatsiden når alle spørgsmål er færdige
  useEffect(() => {
    if (questions.length > 0 && questionNumber > questions.length) {
      router.push('/result');
    }
  }, [questions, questionNumber, router]);

  // 🔀 Blander svarene for det aktuelle spørgsmål
  useEffect(() => {
    if (questions.length === 0) return;

    const currentQuestion = questions[questionNumber - 1];
    if (!currentQuestion) return;

    const shuffled = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);

    setShuffledAnswers(shuffled);
  }, [questions, questionNumber]);

  // ✅ Behandler klik på et svar
  const handleAnswerClick = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    setTimeout(() => {
      if (answer === questions[questionNumber - 1].correct_answer) {
        addScore();
      }
      goToNextQuestion();
    }, 1000);
  };

  // ⌛ Viser loading-indikator
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 space-y-4">
        <div className="flex items-center space-x-2 text-green-800">
          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Loading questions...</span>
        </div>
      </div>
    );
  }

  // ⚠️ Viser fejlbesked hvis noget gik galt
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-xl text-red-800">{error}</p>
      </div>
    );
  }

  // ❌ Hvis ingen spørgsmål blev hentet
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <p className="text-xl text-yellow-800">No questions found.</p>
      </div>
    );
  }

  const currentQuestion = questions[questionNumber - 1];

  // 🔕 Beskytter mod rendering fejl
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-900 text-center">
        Question {questionNumber} / {questions.length}
      </h2>

      <p className="text-sm text-gray-600 text-center">⏳ Time left: {timer}s</p>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl space-y-4">
        <h3
          className="text-lg font-semibold text-gray-800"
          dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
        ></h3>

        <div className="grid gap-3">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              className={`
                p-3 rounded transition
                ${showFeedback ? (
                  answer === currentQuestion.correct_answer
                    ? 'bg-green-400 text-white'
                    : answer === selectedAnswer
                    ? 'bg-red-400 text-white'
                    : 'bg-blue-200 text-blue-800'
                ) : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}
              `}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
