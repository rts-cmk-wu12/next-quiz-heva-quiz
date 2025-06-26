'use client';

// Vi importerer nødvendige hooks og funktioner fra React
import { createContext, useState, useContext, useEffect } from 'react';

// Opretter en ny kontekst til quizzen
const QuizContext = createContext();

// QuizProvider-komponenten, som indpakker hele appen og giver adgang til quizdata via context
export const QuizProvider = ({ children }) => {
  // Gemmer spørgsmålene fra API
  const [questions, setQuestions] = useState([]);
  
  // Brugerens aktuelle score
  const [score, setScore] = useState(0);

  // Højeste score, der nogensinde er opnået (hentes fra localStorage)
  const [highScore, setHighScore] = useState(0);

  // useEffect bruges her til at hente high score én gang, når komponenten først loades
  useEffect(() => {
    const storedHighScore = parseInt(localStorage.getItem('highScore')) || 0;
    setHighScore(storedHighScore);
  }, []);

  // Funktion til at nulstille quizzen
  const resetQuiz = () => {
    setQuestions([]);  // Tøm spørgsmålene
    setScore(0);       // Nulstil scoren
  };

  // Funktion til at øge score og opdatere highScore hvis nødvendigt
  const addScore = () => {
    setScore((prev) => {
      const newScore = prev + 1;
      // Hvis den nye score er højere end den tidligere high score, opdaterer vi localStorage
      if (newScore > highScore) {
        localStorage.setItem('highScore', newScore);
        setHighScore(newScore);
      }
      return newScore;
    });
  };

  // Vi eksponerer quiz-funktionaliteten via QuizContext.Provider
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

// Custom hook så vi nemt kan bruge quizkonteksten i andre komponenter
export const useQuiz = () => useContext(QuizContext);
