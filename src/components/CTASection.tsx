import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Users, Building2, Sparkles } from "lucide-react";
import dinoWaving from "@/assets/dino-waving.png";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: "10.000+", label: "Geschulte Mitarbeiter" },
    { icon: Building2, value: "500+", label: "Unternehmen" },
    { icon: Sparkles, value: "98%", label: "Zufriedenheit" },
  ];

  return (
    <section ref={ref} className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[10%] w-20 h-20 bg-pastel-pink rounded-full opacity-50"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-[15%] w-16 h-16 bg-pastel-blue rounded-full opacity-50"
        />
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-[20%] w-12 h-12 bg-pastel-yellow rounded-full opacity-50"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-[10%] w-24 h-24 bg-pastel-green rounded-full opacity-40"
        />
      </div>

      <div className="container relative z-10">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              className="text-center"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-card rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-soft">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-elevated max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6"
              >
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Bereit zum Start?</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Starte dein{" "}
                <span className="text-gradient">Abenteuer</span>
              </h2>

              <p className="text-muted-foreground mb-8">
                Schütze dein Team vor Cyber-Gefahren – spielerisch, effektiv und mit Spaß!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/quiz">
                  <Button variant="playful" size="xl" className="group">
                    Kostenlos testen
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Demo anfragen
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                ✓ Keine Kreditkarte erforderlich &nbsp; ✓ 14 Tage kostenlos
              </p>
            </div>

            {/* Dino */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, type: "spring" }}
              className="relative flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={dinoWaving}
                  alt="Dino winkt dir zu"
                  className="w-48 md:w-64 drop-shadow-xl"
                />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-2 md:right-4 bg-accent text-accent-foreground rounded-2xl px-4 py-2 shadow-soft"
              >
                <span className="font-display font-bold text-sm">Auf geht&apos;s! 🎮</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
