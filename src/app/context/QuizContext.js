'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const storedHighScore = parseInt(localStorage.getItem('highScore')) || 0;
    setHighScore(storedHighScore);
  }, []);

  const resetQuiz = () => {
    setQuestions([]);
    setScore(0);
  };

  const addScore = () => {
    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore > highScore) {
        localStorage.setItem('highScore', newScore);
        setHighScore(newScore);
      }
      return newScore;
    });
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        setQuestions,
        score,
        highScore,
        addScore,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
