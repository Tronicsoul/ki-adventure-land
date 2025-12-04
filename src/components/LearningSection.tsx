import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, XCircle, BookOpen, Brain, Shield, Sparkles } from "lucide-react";
import dinoTeaching from "@/assets/dino-teaching.png";

const LearningSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const learningTopics = [
    {
      icon: Brain,
      title: "KI-Bilder erkennen",
      items: [
        "Unnatürliche Details finden",
        "Artefakte und Glitches",
        "Hintergrundanalyse",
      ],
      color: "bg-pastel-purple",
    },
    {
      icon: Shield,
      title: "Phishing aufdecken",
      items: [
        "Verdächtige URLs prüfen",
        "Absender verifizieren",
        "Social Engineering erkennen",
      ],
      color: "bg-pastel-blue",
    },
  ];

  const comparisonItems = [
    {
      fake: "CEO bittet um dringende Überweisung",
      real: "Normale Anfrage mit Verifikation",
      type: "phishing",
    },
    {
      fake: "6 Finger, verschwommene Ohren",
      real: "Natürliche Proportionen",
      type: "image",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 bg-secondary overflow-hidden">
      {/* Dino in background */}
      <div className="absolute left-0 top-1/4 lg:left-[3%] pointer-events-none opacity-15 lg:opacity-20">
        <img
          src={dinoTeaching}
          alt=""
          className="w-[200px] md:w-[300px] lg:w-[350px]"
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
          <div className="inline-flex items-center gap-2 bg-dino/20 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-dino" />
            <span className="text-sm font-semibold text-dino">Lerninhalte</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Was du{" "}
            <span className="text-dino">lernst</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Praxisnahe Module, die dich zum Experten für digitale Sicherheit machen.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Learning Topics */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {learningTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                className="bg-card rounded-3xl p-6 shadow-soft"
              >
                <div className={`${topic.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                  <topic.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-4">
                  {topic.title}
                </h3>
                <ul className="space-y-3">
                  {topic.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Comparison Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 bg-card rounded-3xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-xl text-foreground">
                  Echt vs. Fake Challenge
                </h3>
              </div>

              <div className="space-y-4">
                {comparisonItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.15 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="bg-destructive/10 rounded-2xl p-4 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-destructive uppercase">Fake</span>
                        <p className="text-sm text-foreground mt-1">{item.fake}</p>
                      </div>
                    </div>
                    <div className="bg-accent/10 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-accent uppercase">Echt</span>
                        <p className="text-sm text-foreground mt-1">{item.real}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            <div className="bg-card rounded-3xl p-6 shadow-card max-w-xs text-center">
              <p className="font-semibold text-foreground mb-2">
                "Mit etwas Übung erkennst du jeden Fake!"
              </p>
              <p className="text-sm text-muted-foreground">
                – Dino, dein Security-Coach
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
                <p className="text-2xl font-display font-bold text-primary">12+</p>
                <p className="text-xs text-muted-foreground">Module</p>
              </div>
              <div className="bg-card rounded-2xl p-4 text-center shadow-soft">
                <p className="text-2xl font-display font-bold text-accent">50+</p>
                <p className="text-xs text-muted-foreground">Übungen</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;