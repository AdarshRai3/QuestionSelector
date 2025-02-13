"use client"

import type React from "react"
import { useState, useEffect } from "react"
import questionsData from "../questions.json"
import { RefreshCw, Clock } from "lucide-react"



type Problem = {
  title: string
  link: string
  number: number
  completed: boolean
}

const QuestionSelector: React.FC = () => {
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number>(60 * 60)
  const [isSelectionDisabled, setIsSelectionDisabled] = useState<boolean>(false)
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false)
  const [showFinishConfirmation, setShowFinishConfirmation] = useState<boolean>(false)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
  
    if (timeRemaining > 0 && selectedProblems.length > 0 && !isTestCompleted) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTestCompleted(true);
    }
  
    return () => clearInterval(timer);
  }, [timeRemaining, selectedProblems, isTestCompleted]);

  useEffect(() => {
    if (selectedProblems.length > 0 && selectedProblems.every((problem) => problem.completed)) {
      setShowFinishConfirmation(true)
    }
  }, [selectedProblems])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const selectRandomProblems = () => {
    const easy = [...questionsData.easy].sort(() => 0.5 - Math.random()).slice(0, 2)
    const medium = [...questionsData.medium].sort(() => 0.5 - Math.random()).slice(0, 2)
    const hard = [...questionsData.hard].sort(() => 0.5 - Math.random()).slice(0, 1)
    setSelectedProblems([...easy, ...medium, ...hard].map((problem) => ({ ...problem, completed: false })))
    setIsSelectionDisabled(true)
  }

  const resetSelection = () => {
    setSelectedProblems([])
    setIsSelectionDisabled(false)
  }

  const restartTest = () => {
    setSelectedProblems([])
    setTimeRemaining(60 * 60)
    setIsSelectionDisabled(false)
    setIsTestCompleted(false)
    setShowFinishConfirmation(false)
  }

  const toggleProblemCompletion = (index: number) => {
    setSelectedProblems((prevProblems) =>
      prevProblems.map((problem, i) => (i === index ? { ...problem, completed: !problem.completed } : problem)),
    )
  }

  const handleFinishConfirmation = (confirm: boolean) => {
    if (confirm) {
      setIsTestCompleted(true)
    } else {
      setShowFinishConfirmation(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={selectRandomProblems}
          disabled={isSelectionDisabled}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSelectionDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Select Random Problems
        </button>
        <button
          onClick={resetSelection}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      <div className="mb-4 flex items-center justify-center text-xl font-bold">
        <Clock className="mr-2 h-6 w-6" />
        {formatTime(timeRemaining)}
      </div>
      <ul className="space-y-2 mt-4">
        {selectedProblems.map((problem, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={problem.completed}
              onChange={() => toggleProblemCompletion(index)}
              className="mr-2 h-5 w-5 text-blue-600"
            />
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 hover:text-blue-800 visited:text-purple-600 ${problem.completed ? "line-through" : ""}`}
            >
              {problem.number}. {problem.title}
            </a>
          </li>
        ))}
      </ul>
      {showFinishConfirmation && !isTestCompleted && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Do you want to finish the test?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleFinishConfirmation(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Yes
              </button>
              <button
                onClick={() => handleFinishConfirmation(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {isTestCompleted && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Your test is completed!</h2>
            <button
              onClick={restartTest}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionSelector

