import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Eye, Mail, ImageIcon } from "lucide-react";
import dinoDetective from "@/assets/dino-detective.png";

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      icon: ImageIcon,
      title: "KI-generierte Bilder",
      description: "Deepfakes werden immer realistischer und schwerer zu erkennen.",
      color: "bg-pastel-pink",
    },
    {
      icon: Mail,
      title: "Phishing-Angriffe",
      description: "Raffinierte E-Mails täuschen selbst erfahrene Mitarbeiter.",
      color: "bg-pastel-blue",
    },
    {
      icon: AlertTriangle,
      title: "Datendiebstahl",
      description: "Sensible Unternehmensdaten sind ständig in Gefahr.",
      color: "bg-pastel-yellow",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 bg-secondary overflow-hidden">
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-background" style={{
        clipPath: "ellipse(70% 100% at 50% 0%)"
      }} />

      <div className="container relative z-10 pt-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dino with magnifying glass */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center order-2 lg:order-1"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={dinoDetective}
                alt="Dino untersucht verdächtige Inhalte"
                className="w-64 md:w-80 lg:w-96 drop-shadow-xl"
              />
            </motion.div>

            {/* Fake vs Real comparison card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-4 -right-4 md:bottom-0 md:right-0 lg:-right-10"
            >
              <div className="bg-card rounded-3xl p-4 shadow-elevated border-2 border-border/50">
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mb-2">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <span className="text-xs font-bold text-destructive">Fake</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-2">
                      <span className="text-2xl">✅</span>
                    </div>
                    <span className="text-xs font-bold text-accent">Echt</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Erkennst du den Unterschied?
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-4 py-2 mb-6">
                <Eye className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Das Problem</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                KI-Fakes werden immer{" "}
                <span className="text-destructive">gefährlicher</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10">
                Cyberkriminelle nutzen künstliche Intelligenz, um täuschend echte Fälschungen 
                zu erstellen. Ohne das richtige Training sind Mitarbeitende schutzlos.
              </p>
            </motion.div>

            {/* Problem cards */}
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                  className="flex items-start gap-4 p-4 bg-card rounded-2xl shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className={`${problem.color} p-3 rounded-xl shrink-0`}>
                    <problem.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {problem.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
