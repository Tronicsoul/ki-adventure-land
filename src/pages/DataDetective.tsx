import { DetectiveGame } from "@/components/dda/DetectiveGame";
import Footer from "@/components/Footer";
import NavLink from "@/components/NavLink";

const DataDetective = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
                <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    KI Adventure Land
                </NavLink>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400 font-mono text-sm">DATA_DETECTIVE_AGENCY</span>
            </div>
            <nav className="hidden md:flex gap-6">
                <NavLink to="/" className="text-slate-400 hover:text-white transition-colors">Home</NavLink>
                <NavLink to="/quiz" className="text-slate-400 hover:text-white transition-colors">Quiz</NavLink>
                <NavLink to="/story-detective" className="text-slate-400 hover:text-white transition-colors">Detective Storymode</NavLink>
            </nav>
        </header>

        <main className="mb-20">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Daten <span className="text-indigo-500">Detektiv</span> Büro
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Willkommen in der Abteilung für digitale Forensik. Löse Fälle, analysiere Daten und schütze das KI Adventure Land vor Cyber-Bedrohungen.
                </p>
            </div>

            <DetectiveGame />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DataDetective;