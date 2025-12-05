import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import dinoWaving from "@/assets/dino-waving.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 blob" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-accent/20 blob" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-pastel-yellow/40 blob" />
      </div>

      {/* Dino in background - positioned behind content */}
      <div className="absolute right-0 bottom-0 lg:right-[10%] lg:bottom-[5%] pointer-events-none opacity-30 lg:opacity-50">
        <img
          src={dinoWaving}
          alt=""
          className="w-[300px] md:w-[400px] lg:w-[500px]"
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto lg:mx-0">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-secondary-foreground">
                Spielerisch gegen Cyber-Gefahren
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight"
            >
              Willkommen im{" "}
              <span className="text-gradient">KI-Dschungel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Trainiere dein Team spielerisch im Erkennen von KI-Fakes und Phishing – 
              mit unserem gamifizierten Awareness-Tool.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/story">
                <Button variant="playful" size="xl" className="group">
                  <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Story-Modus starten
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant="outline" size="lg">
                  Fake vs. Echt Quiz
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[pastelColors[0], pastelColors[1], pastelColors[2]].map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {["🎮", "🛡️", "🎯"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">500+</strong> Unternehmen vertrauen uns
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium">Scroll nach unten</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const pastelColors = ["#f8bbd9", "#b3e5fc", "#c8e6c9"];

export default HeroSection;