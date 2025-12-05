import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhishingGame from "@/components/PhishingGame";
import dinoDetective from "@/assets/dino-detective.png";

const StoryMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 blob" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 blob" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-pastel-yellow/20 blob" />
      </div>

      {/* Dino in background */}
      <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
        <img
          src={dinoDetective}
          alt=""
          className="w-[300px] md:w-[400px]"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-display text-xl text-foreground">Story-Modus</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Intro section */}
        <div className="text-center mb-8 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-secondary-foreground">
              Phishing-Erkennung trainieren
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            Cyber-Dschungel Mission
          </h2>
          <p className="text-muted-foreground">
            Lerne echte von gefälschten Nachrichten zu unterscheiden. 
            Sammle Punkte, baue Combos auf und werde zum Phishing-Experten!
          </p>
        </div>

        {/* Game features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
          {[
            { icon: Eye, label: "Erkennen", desc: "Phishing vs Echt" },
            { icon: Trophy, label: "Punkte", desc: "Zeitbonus" },
            { icon: Target, label: "Combos", desc: "Serien-Bonus" },
            { icon: Shield, label: "Lernen", desc: "Erklärungen" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-card/50 rounded-2xl p-3 text-center">
              <Icon className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="font-display font-semibold text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Game */}
        <PhishingGame onClose={() => navigate("/")} />
      </main>
    </div>
  );
};

export default StoryMode;
