import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import dinoWaving from "@/assets/dino-waving.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-20 pb-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-secondary mb-6">
              Entdecke die Welt der <br />
              <span className="text-primary">Künstlichen Intelligenz</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto mb-8">
              Lerne spielerisch, wie KI funktioniert. Begleite unseren Dino auf einer
              Reise durch die digitale Welt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/story">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Abenteuer starten
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2">
                  Quiz spielen
                </Button>
              </Link>
              <Link to="/detective">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6 rounded-full border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700">
                  Detektiv-Büro
                </Button>
              </Link>
              <Link to="/game">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6 rounded-full border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700">
                  Play a Game
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative w-full max-w-lg aspect-square mt-8 animate-float">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-50" />
            <img 
              src={dinoWaving} 
              alt="Dino Waving" 
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;