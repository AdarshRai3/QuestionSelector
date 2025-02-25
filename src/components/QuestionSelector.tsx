import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import questionsData from "../question.json";

type Problem = {
  Problems: string;
  Difficulty: "Easy" | "Medium" | "Hard";
  Number: number;
  Link: string;
  completed?: boolean;
};

type Props = {
  theme: "dark" | "light";
  onSolvedChange?: (solved: number) => void;
};

const questions: Problem[] = questionsData as Problem[];

// Points based on the problem's Number value.
const calculatePoints = (number: number): number => {
  switch (number) {
    case 1:
      return 1;
    case 2:
      return 3;
    case 3:
      return 5;
    default:
      return 0;
  }
};

const calculateTotalPossiblePoints = (problems: Problem[]): number =>
  problems.reduce((total, problem) => total + calculatePoints(problem.Number), 0);

const calculateEarnedPoints = (problems: Problem[]): number =>
  problems.reduce(
    (total, problem) => (problem.completed ? total + calculatePoints(problem.Number) : total),
    0
  );

// Map level (1-6) to a style reflecting Goku's transformation.
const getLevelStyle = (level: number): string => {
  switch (level) {
    case 1:
      return "bg-gray-500 text-white"; // Normal
    case 2:
      return "bg-yellow-200 text-black"; // Super Saiyan 1
    case 3:
      return "bg-yellow-400 text-black"; // Super Saiyan 2
    case 4:
      return "bg-yellow-600 text-white"; // Super Saiyan 3
    case 5:
      return "bg-red-500 text-white"; // Super Saiyan Red
    case 6:
      return "bg-blue-500 text-white"; // Super Saiyan Blue
    default:
      return "bg-gray-500 text-white";
  }
};

const QuestionSelector: React.FC<Props> = ({ theme, onSolvedChange }) => {
  // Set test limit to 2 hours (7200 seconds)
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(7200);
  const [isSelectionDisabled, setIsSelectionDisabled] = useState<boolean>(false);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    if (timeRemaining > 0 && selectedProblems.length > 0 && !isTestCompleted) {
      timer = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTestCompleted(true);
    }
    return () => {
      if (timer !== undefined) clearInterval(timer);
    };
  }, [timeRemaining, selectedProblems, isTestCompleted]);

  // Show finish confirmation when all problems are completed
  useEffect(() => {
    if (selectedProblems.length > 0 && selectedProblems.every((p) => p.completed)) {
      setShowFinishConfirmation(true);
    }
  }, [selectedProblems]);

  // Report solved count to parent (for the navbar Levels button)
  useEffect(() => {
    const solved = selectedProblems.filter((p) => p.completed).length;
    if (onSolvedChange) onSolvedChange(solved);
  }, [selectedProblems, onSolvedChange]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Selects 2 Easy, 3 Medium, and 1 Hard question and sorts them by difficulty.
  const selectRandomProblems = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const easy = questions.filter((q) => q.Difficulty === "Easy");
    const medium = questions.filter((q) => q.Difficulty === "Medium");
    const hard = questions.filter((q) => q.Difficulty === "Hard");

    const selectedEasy = [...easy].sort(() => 0.5 - Math.random()).slice(0, 2);
    const selectedMedium = [...medium].sort(() => 0.5 - Math.random()).slice(0, 3);
    const selectedHard = [...hard].sort(() => 0.5 - Math.random()).slice(0, 1);

    const combined = [...selectedEasy, ...selectedMedium, ...selectedHard].map((problem) => ({
      ...problem,
      completed: false,
    }));

    // Sort in order: Easy → Medium → Hard
    const order = { Easy: 1, Medium: 2, Hard: 3 };
    combined.sort((a, b) => order[a.Difficulty] - order[b.Difficulty]);

    setSelectedProblems(combined);
    setIsSelectionDisabled(true);
    setIsLoading(false);
  };

  // "Finish" button ends the test immediately.
  const quitTest = () => {
    setIsTestCompleted(true);
  };

  const restartTest = () => {
    setSelectedProblems([]);
    setTimeRemaining(7200);
    setIsSelectionDisabled(false);
    setIsTestCompleted(false);
    setShowFinishConfirmation(false);
  };

  const toggleProblemCompletion = (index: number) => {
    setSelectedProblems((prev) =>
      prev.map((problem, i) =>
        i === index ? { ...problem, completed: !problem.completed } : problem
      )
    );
  };

  const handleFinishConfirmation = (confirm: boolean) => {
    if (confirm) {
      setIsTestCompleted(true);
    } else {
      setShowFinishConfirmation(false);
    }
  };

  const earnedPoints = calculateEarnedPoints(selectedProblems);
  const totalPossiblePoints = calculateTotalPossiblePoints(selectedProblems);
  const scorePercentage =
    totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={selectRandomProblems}
          disabled={isSelectionDisabled || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Selecting Problems..." : "Select Random Problems"}
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-lg font-semibold text-blue-500">
            <Clock className="h-5 w-5 mr-1 text-blue-500" />
            {formatTime(timeRemaining)}
          </div>
          <button
            onClick={quitTest}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Finish
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className={theme === "dark" ? "bg-gray-800" : "bg-gray-200"}>
            <tr>
              <th className="py-3 px-4 border border-gray-300">Level</th>
              <th className="py-3 px-4 border border-gray-300">Status</th>
              <th className="py-3 px-4 border border-gray-300">Problem</th>
              <th className="py-3 px-4 border border-gray-300 text-center">Difficulty</th>
              <th className="py-3 px-4 border border-gray-300 text-center">Points</th>
              <th className="py-3 px-4 border border-gray-300">Link</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="py-3 px-4 border border-gray-300">Loading</td>
                    <td className="py-3 px-4 border border-gray-300">Loading</td>
                    <td className="py-3 px-4 border border-gray-300">Loading</td>
                    <td className="py-3 px-4 border border-gray-300 text-center">Loading</td>
                    <td className="py-3 px-4 border border-gray-300 text-center">Loading</td>
                    <td className="py-3 px-4 border border-gray-300">Loading</td>
                  </tr>
                ))
              : selectedProblems.map((problem, index) => (
                  <tr
                    key={index}
                    className={
                      problem.completed
                        ? theme === "dark"
                          ? "bg-sky-100 text-black font-semibold"
                          : "bg-blue-100"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-blue-50"
                    }
                  >
                    <td className="py-3 px-4 border border-gray-300">
                      <button className={`px-2 py-1 rounded ${getLevelStyle(index + 1)}`}>
                        Level {index + 1}
                      </button>
                    </td>
                    <td className="py-3 px-4 border border-gray-300 text-center">
                      <input
                        type="checkbox"
                        checked={problem.completed}
                        onChange={() => toggleProblemCompletion(index)}
                        className="h-5 w-5"
                      />
                    </td>
                    <td className="py-3 px-4 border border-gray-300">{problem.Problems}</td>
                    <td className="py-3 px-4 border border-gray-300 text-center">{problem.Difficulty}</td>
                    <td className="py-3 px-4 border border-gray-300 text-center">
                      {calculatePoints(problem.Number)}
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      <a
                        href={problem.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Solve
                      </a>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showFinishConfirmation && !isTestCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Finish Test?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleFinishConfirmation(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => handleFinishConfirmation(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isTestCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
            <p className="text-lg font-semibold mb-2">Your Score: {scorePercentage}%</p>
            <p className="mb-4">
              {earnedPoints} / {totalPossiblePoints} points
            </p>
            <button
              onClick={restartTest}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Start New Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSelector;
