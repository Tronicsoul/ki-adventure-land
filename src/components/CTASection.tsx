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
      {/* Dino in background */}
      <div className="absolute right-0 bottom-0 lg:right-[5%] pointer-events-none opacity-20 lg:opacity-30">
        <img
          src={dinoWaving}
          alt=""
          className="w-[250px] md:w-[350px] lg:w-[400px]"
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
              transition={{ delay: 0.2 + index * 0.1 }}
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
          className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-elevated max-w-3xl mx-auto"
        >
          <div className="text-center">
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

            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Schütze dein Team vor Cyber-Gefahren – spielerisch, effektiv und mit Spaß!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

            <p className="text-xs text-muted-foreground mt-6">
              ✓ Keine Kreditkarte erforderlich &nbsp; ✓ 14 Tage kostenlos
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;