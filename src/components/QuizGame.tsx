import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, RotateCcw, Sparkles } from "lucide-react";
import aiPortrait1 from "@/assets/ai-portrait-1.png";
import aiPortrait2 from "@/assets/ai-portrait-2.png";

interface QuizQuestion {
  id: number;
  image: string;
  isReal: boolean;
  explanation: string;
  hint: string;
}

const baseQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    isReal: true,
    explanation: "Dieses Foto ist echt! Die natürlichen Hautunregelmäßigkeiten und Lichtverhältnisse sind typisch für echte Aufnahmen.",
    hint: "Achte auf natürliche Hautdetails"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    isReal: true,
    explanation: "Ein echtes Portrait! Die asymmetrischen Gesichtszüge und natürliche Beleuchtung verraten es.",
    hint: "Symmetrie ist verdächtig perfekt bei KI"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
    isReal: true,
    explanation: "Echtes Foto - beachte die natürlichen Reflexionen in den Augen und die realistischen Haarsträhnen.",
    hint: "KI hat oft Probleme mit Haaren"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop",
    isReal: true,
    explanation: "Ein authentisches Portrait mit natürlichen Schatten und Texturen.",
    hint: "Schatten verraten viel über Echtheit"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop",
    isReal: true,
    explanation: "Dieses Foto zeigt eine echte Person - die Augenreflexionen und Hauttextur sind authentisch.",
    hint: "Augenreflexionen prüfen!"
  },
  {
    id: 6,
    image: aiPortrait1,
    isReal: false,
    explanation: "Dieses Bild wurde von KI generiert! Achte auf die zu perfekte Haut und die leicht unnatürlichen Augendetails.",
    hint: "Zu perfekte Haut ist verdächtig"
  },
  {
    id: 7,
    image: aiPortrait2,
    isReal: false,
    explanation: "Ein KI-generiertes Portrait! Die Haare und der Hintergrund zeigen typische KI-Artefakte.",
    hint: "Überprüfe Haardetails genau"
  }
];

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface QuizGameProps {
  onClose?: () => void;
}

const QuizGame = ({ onClose }: QuizGameProps) => {
  const quizQuestions = useMemo(() => shuffleArray(baseQuizQuestions), []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (userAnswer: boolean) => {
    const correct = userAnswer === quizQuestions[currentQuestion].isReal;
    setIsCorrect(correct);
    setLastAnswer(userAnswer);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + (showHint ? 50 : 100));
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setShowHint(false);
    setLastAnswer(null);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowFeedback(false);
    setLastAnswer(null);
    setIsCorrect(false);
    setGameFinished(false);
    setShowHint(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / (quizQuestions.length * 100)) * 100;
    if (percentage >= 80) return "Fantastisch! Du bist ein KI-Detektiv! 🎉";
    if (percentage >= 60) return "Gut gemacht! Weiter üben! 💪";
    if (percentage >= 40) return "Nicht schlecht, aber da geht noch mehr! 📚";
    return "Übung macht den Meister! Versuch es nochmal! 🔄";
  };

  if (gameFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-8 shadow-playful max-w-lg mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Trophy className="w-20 h-20 text-badge mx-auto mb-4" />
        </motion.div>
        
        <h2 className="font-display text-3xl text-foreground mb-2">Spiel beendet!</h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/10 rounded-2xl p-6 mb-6"
        >
          <p className="text-5xl font-bold text-primary mb-2">{score}</p>
          <p className="text-muted-foreground">von {quizQuestions.length * 100} Punkten</p>
        </motion.div>
        
        <p className="text-lg text-foreground mb-6">{getScoreMessage()}</p>
        
        <div className="flex gap-4 justify-center">
          <Button variant="playful" onClick={restartGame} className="gap-2">
            <RotateCcw className="w-5 h-5" />
            Nochmal spielen
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Zurück
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Frage {currentQuestion + 1} von {quizQuestions.length}
          </span>
          <div className="flex items-center gap-2 bg-badge/20 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-badge" />
            <span className="font-bold text-foreground">{score} Punkte</span>
          </div>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-3xl shadow-playful overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={question.image}
            alt="Quiz Bild"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-2xl text-foreground mb-4 text-center">
            Ist dieses Bild echt oder KI-generiert?
          </h3>

          {/* Hint Button */}
          {!showFeedback && (
            <AnimatePresence>
              {!showHint ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowHint(true)}
                  className="w-full text-center text-sm text-primary hover:underline mb-4"
                >
                  💡 Tipp anzeigen (-50 Punkte bei richtiger Antwort)
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-accent/20 rounded-xl p-4 mb-4 text-center"
                >
                  <p className="text-sm text-foreground">💡 {question.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Answer Buttons */}
          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4"
              >
                <Button
                  variant="playful"
                  size="lg"
                  className="flex-1 text-lg"
                  onClick={() => handleAnswer(true)}
                >
                  ✓ Echt
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleAnswer(false)}
                >
                  ✗ KI-Fake
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Feedback Banner */}
                <div
                  className={`rounded-2xl p-4 flex items-center gap-3 ${
                    isCorrect
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-bold ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                      {isCorrect ? `Richtig! +${showHint ? 50 : 100} Punkte` : "Leider falsch!"}
                    </p>
                    <p className="text-sm text-foreground/80">
                      Das Bild ist {question.isReal ? "echt" : "KI-generiert"}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>

                {/* Next Button */}
                <Button
                  variant="playful"
                  size="lg"
                  className="w-full"
                  onClick={nextQuestion}
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Nächste Frage →" : "Ergebnis anzeigen 🎉"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizGame;
