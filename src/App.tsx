import React, { useState } from "react";
import QuestionSelector from "./components/QuestionSelector";
import { Sun, Moon, X } from "lucide-react";
// Import images from src/assets/Images folder
import baseImg from "./assets/Images/BaseGoku.jpg";
import ssj1Img from "./assets/Images/Saiyan1.jpg";
import ssj2Img from "./assets/Images/Saiyan2.jpg";
import ssj3Img from "./assets/Images/Saiyan3.jpg";
import ssgodImg from "./assets/Images/Super Saiyan Red.jpg";
import ssblueImg from "./assets/Images/Super Saiyan Blue.jpg";
import ultrainstinctImg from "./assets/Images/UltraInstinct.jpg";

type TransformationDetail = {
  title: string;
  achieved: string;
  quote: string;
};

const transformationDetails: TransformationDetail[] = [
  {
    title: "Base",
    achieved: "Goku's natural state, where all his potential quietly resides.",
    quote: "The greatest battles of life are fought in the silent chambers of your soul. Before you can transform your body, you must first transform your mind.",
  },
  {
    title: "Super Saiyan",
    achieved: "Goku first transformed after witnessing tragedy and feeling intense emotion.",
    quote: "Your pain today will be your strength tomorrow. What breaks you now is forging the warrior you're destined to become.",
  },
  {
    title: "Super Saiyan 2",
    achieved: "Through relentless training and battles, Goku pushed beyond his limits.",
    quote: "When you think you've reached your limit, you've only reached the threshold of your previous thinking. The real journey begins at the edge of your comfort zone.",
  },
  {
    title: "Super Saiyan 3",
    achieved: "In moments of desperation and overwhelming power, Goku unlocked a higher form.",
    quote: "It's in your darkest hour, when every fiber of your being screams to surrender, that your true transformation awaits. Push one second longer than you think possible.",
  },
  {
    title: "Super Saiyan God",
    achieved: "By gathering the energy of pure-hearted Saiyans, Goku reached divine power.",
    quote: "You were born with greatness encoded in your DNA. Your ancestors survived everything life threw at them so you could be here. Their strength flows through your veins—honor their sacrifice.",
  },
  {
    title: "Super Saiyan Blue",
    achieved: "Merging the power of a god with his own, Goku attained a calm yet formidable force.",
    quote: "Discipline is choosing between what you want now and what you want most. Your future self is watching you right now through memories—make those memories worth reliving.",
  },
  {
    title: "Ultra Instinct",
    achieved: "After endless trials and transcending mortal limits, Goku tapped into instinctual mastery.",
    quote: "At the end of your life, your regrets won't come from the things you tried and failed—they'll come from the dreams you left to wither while you made excuses. Stop thinking. Start becoming.",
  },
];

const transformationImages: string[] = [
  baseImg,         // Base
  ssj1Img,         // Super Saiyan
  ssj2Img,         // Super Saiyan 2
  ssj3Img,         // Super Saiyan 3
  ssgodImg,        // Super Saiyan God
  ssblueImg,       // Super Saiyan Blue
  ultrainstinctImg // Ultra Instinct
];

const getNavbarLevelStyle = (level: number) => {
  const styles = [
    "bg-gray-500 text-white",
    "bg-yellow-400 text-black",
    "bg-yellow-500 text-black",
    "bg-orange-500 text-white",
    "bg-red-500 text-white",
    "bg-blue-500 text-white",
    "bg-white text-black border border-blue-500",
  ];
  return styles[level] || styles[0];
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Ensure level is within range 0-6
  const level = Math.min(solvedCount, 6);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4 border-b border-blue-500">
        <span className="text-2xl font-bold">LeetCode Practice</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className={`px-4 py-2 rounded transition-colors ${getNavbarLevelStyle(level)}`}
          >
            Solved: {solvedCount}/6
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <div className="p-6">
        <QuestionSelector theme={theme} onSolvedChange={setSolvedCount} />
      </div>

      {/* Redesigned Transformation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full overflow-hidden">
            {/* Top Right Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors" />
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Image Container that adapts width to image size */}
              <div className="flex-none h-64 bg-gray-200 flex items-center justify-center">
                <img
                  src={transformationImages[level]}
                  alt={transformationDetails[level].title}
                  className="h-full object-contain"
                />
              </div>
              {/* Right Side: Details */}
              <div className="flex-grow p-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">
                  {transformationDetails[level].title} — Level {level}
                </h2>
                <p className="mb-2 font-medium">
                  {transformationDetails[level].achieved}
                </p>
                <p className="mb-4 italic">
                  "{transformationDetails[level].quote}"
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Solve challenging problems to unlock your next form and evolve
                  just like Goku did in his epic battles.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
