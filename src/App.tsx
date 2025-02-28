import React, { useState} from "react";
import QuestionSelector from "./components/QuestionSelector";
import { Sun, Moon, X } from "lucide-react";
import { TypingAnimation } from "./components/magicui/typing-animation";
import baseImg from "./assets/Images/BaseGoku.jpg";
import ssj1Img from "./assets/Images/Saiyan1.jpg";
import ssj2Img from "./assets/Images/Saiyan2.jpg";
import ssj3Img from "./assets/Images/Saiyan3.jpg";
import ssgodImg from "./assets/Images/Super Saiyan Red.jpg";
import ssblueImg from "./assets/Images/Super Saiyan Blue.jpg";
import ultrainstinctImg from "./assets/Images/UltraInstinct.jpg";
// import { Confetti, type ConfettiRef } from "./components/magicui/confetti";
import { InteractiveGridPattern } from "./components/magicui/interactive-grid-pattern";
import { cn } from "@/lib/utils";

type TransformationDetail = {
  title: string;
  quote: string;
};

const transformationDetails: TransformationDetail[] = [
  {
    title: "Base",
    quote:
      "The greatest battles of life are fought in the silent chambers of your soul. Before you can transform your body, you must first transform your mind.",
  },
  {
    title: "Super Saiyan",
    quote:
      "Your pain today will be your strength tomorrow. What breaks you now is forging the warrior you're destined to become.",
  },
  {
    title: "Super Saiyan 2",
    quote:
      "When you think you've reached your limit, you've only reached the threshold of your previous thinking. The real journey begins at the edge of your comfort zone.",
  },
  {
    title: "Super Saiyan 3",
    quote:
      "It's in your darkest hour, when every fiber of your being screams to surrender, that your true transformation awaits. Push one second longer than you think possible.",
  },
  {
    title: "Super Saiyan God",
    quote:
      "You were born with greatness encoded in your DNA. Your ancestors survived everything life threw at them so you could be here. Their strength flows through your veins—honor their sacrifice.",
  },
  {
    title: "Super Saiyan Blue",
    quote:
      "Discipline is choosing between what you want now and what you want most. Your future self is watching you right now through memories—make those memories worth reliving.",
  },
  {
    title: "Ultra Instinct",
    quote:
      "At the end of your life, your regrets won't come from the things you tried and failed—they'll come from the dreams you left to wither while you made excuses. Stop thinking. Start becoming.",
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

const getBeamColor = (level: number) => {
  const beamColors = [
    "ring-2 ring-gray-500",
    "ring-2 ring-yellow-400",
    "ring-2 ring-yellow-500",
    "ring-2 ring-orange-500",
    "ring-2 ring-red-500",
    "ring-2 ring-blue-500",
    "ring-2 ring-white",
  ];
  return beamColors[level] || "ring-2 ring-gray-500";
};

const App: React.FC = () => {
  // const confettiRef = useRef<ConfettiRef>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Ensure level is within range 0-6
  const level = Math.min(solvedCount, 6);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Fire confetti only once when the modal opens
  // useEffect(() => {
  //   if (showModal) {
  //     confettiRef.current?.fire({});
  //   }
  // }, [showModal]);

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
            className={`px-4 py-2 rounded transition-colors ${getNavbarLevelStyle(level)} ring-2 ring-current`}
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

      {/* Transformation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Interactive Grid Pattern as Background */}
          <InteractiveGridPattern
            className={cn(
              "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            )}
          />
          {/* <Confetti
            ref={confettiRef}
            className="absolute left-0 top-0 z-30 size-full pointer-events-none"
          /> */}
          <div
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full overflow-hidden ${getBeamColor(
              level
            )}`}
          >
            {/* Top Right Close Icon */}
            <button
              onClick={() => {
                setShowModal(false);
              }}
              className="absolute top-4 right-4"
            >
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors" />
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Image Container */}
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
                <p className="mb-4 italic text-sm">
                  <TypingAnimation>{transformationDetails[level].quote}</TypingAnimation>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Solve challenging problems to unlock your next form and evolve just like Goku did in his epic battles.
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
