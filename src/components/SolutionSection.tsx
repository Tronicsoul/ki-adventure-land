import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Star, Target, Zap, Award, TrendingUp } from "lucide-react";
import dinoCelebrating from "@/assets/dino-celebrating.png";

const SolutionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Target,
      title: "Story-Modus",
      description: "Erlebe spannende Missionen und decke Cyber-Gefahren auf.",
      color: "from-primary to-primary/70",
    },
    {
      icon: Star,
      title: "Punkte sammeln",
      description: "Verdiene XP für jede richtige Antwort und steige auf.",
      color: "from-accent to-accent/70",
    },
    {
      icon: Trophy,
      title: "Level & Badges",
      description: "Schalte neue Level frei und sammle coole Abzeichen.",
      color: "from-dino to-dino/70",
    },
    {
      icon: Zap,
      title: "Herausforderungen",
      description: "Tägliche Challenges halten dich auf Trab.",
      color: "from-pastel-pink to-pastel-purple",
    },
  ];

  const badges = [
    { emoji: "🥉", name: "Anfänger", level: 1 },
    { emoji: "🥈", name: "Profi", level: 5 },
    { emoji: "🥇", name: "Experte", level: 10 },
    { emoji: "💎", name: "Meister", level: 20 },
  ];

  return (
    <section ref={ref} className="relative py-24 bg-background overflow-hidden">
      {/* Dino in background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 lg:right-[5%] pointer-events-none opacity-15 lg:opacity-25">
        <img
          src={dinoCelebrating}
          alt=""
          className="w-[250px] md:w-[350px] lg:w-[400px]"
        />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Die Lösung</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Lernen, das{" "}
            <span className="text-gradient">Spaß macht</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unser gamifiziertes Lernsystem verwandelt trockene Security-Schulungen 
            in ein spannendes Abenteuer.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="group bg-card rounded-3xl p-6 shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Gamification showcase */}
          <div className="space-y-6">
            {/* Progress card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl p-6 shadow-elevated"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dein Level</p>
                  <p className="font-display font-bold text-xl text-foreground">Level 7</p>
                </div>
                <div className="ml-auto bg-accent text-accent-foreground rounded-full px-4 py-2">
                  <span className="font-display font-bold text-sm">+50 XP</span>
                </div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "70%" } : {}}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">700/1000 XP bis Level 8</p>
            </motion.div>

            {/* Badges row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-3xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h4 className="font-display font-bold text-foreground">Deine Badges</h4>
              </div>
              <div className="flex justify-between">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`text-center ${index > 1 ? "opacity-40" : ""}`}
                  >
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-2 mx-auto">
                      <span className="text-2xl">{badge.emoji}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">Lvl {badge.level}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;