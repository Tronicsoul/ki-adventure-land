import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import dinoWaving from "@/assets/dino-waving.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 blob"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-32 w-80 h-80 bg-accent/20 blob"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-64 h-64 bg-pastel-yellow/40 blob"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
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
              <Link to="/quiz">
                <Button variant="playful" size="xl" className="group">
                  <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Jetzt die Demo spielen
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Mehr erfahren
              </Button>
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

          {/* Dino Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src={dinoWaving}
                alt="Dino Maskottchen winkt"
                className="w-72 md:w-96 lg:w-[450px] drop-shadow-2xl"
              />
              
              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring", bounce: 0.5 }}
                className="absolute -top-4 -right-4 md:top-0 md:right-0 bg-card rounded-3xl p-4 shadow-card max-w-[200px]"
              >
                <p className="text-sm font-semibold text-foreground">
                  Hey! Ich bin Dino, dein Guide! 🦖
                </p>
                <div className="absolute bottom-0 left-8 w-4 h-4 bg-card transform rotate-45 translate-y-2" />
              </motion.div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 bg-pastel-pink rounded-2xl p-3 shadow-soft"
            >
              <span className="text-2xl">🎯</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 left-0 bg-pastel-blue rounded-2xl p-3 shadow-soft"
            >
              <span className="text-2xl">🛡️</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 right-10 bg-pastel-green rounded-2xl p-3 shadow-soft"
            >
              <span className="text-2xl">⭐</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm font-medium">Scroll nach unten</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const pastelColors = ["#f8bbd9", "#b3e5fc", "#c8e6c9"];

export default HeroSection;
