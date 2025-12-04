import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import QuizGame from "@/components/QuizGame";
import { Button } from "@/components/ui/button";

const Quiz = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          </Link>
          <h1 className="font-display text-xl text-foreground">Fake vs. Echt Quiz</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <img 
              src="/src/assets/dino-detective.png" 
              alt="Dino Detective" 
              className="w-16 h-16 object-contain"
            />
            <div className="bg-card rounded-2xl px-4 py-2 shadow-soft">
              <p className="text-sm text-foreground">
                Erkennst du den Unterschied zwischen echten Fotos und KI-Fakes?
              </p>
            </div>
          </div>
        </motion.div>

        <QuizGame />
      </main>
    </div>
  );
};

export default Quiz;
