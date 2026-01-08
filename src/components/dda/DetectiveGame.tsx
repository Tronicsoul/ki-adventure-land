import { useState } from "react";
import { JSX } from "react";
import { detectiveCases, Case } from "../../data/detectiveCases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Search, Terminal, ShieldAlert, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import dinoDetective from "@/assets/dino-detective.png"; 

export const DetectiveGame = () => {
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [gameStep, setGameStep] = useState<"briefing" | "investigation" | "solved" | "failed">("briefing");
  const [feedback, setFeedback] = useState<string>("");

  const startCase = (selectedCase: Case) => {
    setActiveCase(selectedCase);
    setGameStep("briefing");
    setFeedback("");
  };

  const solveCase = (isGuilty: boolean, reason: string) => {
    setFeedback(reason);
    setGameStep(isGuilty ? "solved" : "failed");
  };

  const resetGame = () => {
    setActiveCase(null);
    setGameStep("briefing");
    setFeedback("");
  };

  if (!activeCase) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {detectiveCases.map((c) => (
          <Card key={c.id} className="bg-slate-900 border-slate-700 text-slate-100 hover:border-indigo-500 transition-all duration-300 shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search size={100} />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={c.difficulty === "Einfach" ? "secondary" : "destructive"} className="mb-2">
                  <span>{c.difficulty}</span>
                </Badge>
                <Terminal className="text-indigo-400" />
              </div>
              <CardTitle className="text-xl text-indigo-300">{c.title}</CardTitle>
              <CardDescription className="text-slate-400">{c.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => startCase(c)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Fall übernehmen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-500/30">
                <img src={dinoDetective} alt="Detective Dino" className="h-10 w-10 object-contain" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">Fall #{activeCase.id}: {activeCase.title}</h2>
                <p className="text-sm text-indigo-400">Status: {gameStep === "solved" ? "Gelöst" : "Ermittlung läuft"}</p>
            </div>
        </div>
        <Button variant="ghost" onClick={resetGame} className="text-slate-400 hover:text-white hover:bg-slate-800">
          Fall abbrechen
        </Button>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        {/* Main Content Area */}
        <Card className="bg-slate-950 border-slate-800 text-slate-200 shadow-2xl min-h-[500px] flex flex-col">
          <CardContent className="p-6 flex-1">
            {gameStep === "briefing" && (
              <div className="space-y-6 text-center py-10">
                <ShieldAlert className="w-20 h-20 mx-auto text-indigo-500 animate-pulse" />
                <h3 className="text-2xl font-bold text-white">Missions-Briefing</h3>
                <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                  "{activeCase.missionBrief}"
                </p>
                <Button size="lg" onClick={() => setGameStep("investigation")} className="bg-emerald-600 hover:bg-emerald-700 text-white mt-8 group">
                  Ermittlung starten <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {gameStep === "investigation" && (
              <Tabs defaultValue="evidence" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-slate-900">
                  <TabsTrigger value="evidence">Beweismittel</TabsTrigger>
                  <TabsTrigger value="solve">Fall lösen</TabsTrigger>
                </TabsList>
                
                <TabsContent value="evidence" className="flex-1 mt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {activeCase.evidence.map((ev, index) => (
                        <div key={index} className="bg-slate-900 p-4 rounded-lg border-l-4 border-indigo-500 hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs uppercase tracking-wider font-bold">
                            <Search className="w-3 h-3" />
                            {ev.type}
                          </div>
                          <p className="font-mono text-sm text-green-400 mb-2">
                            {ev.content}
                          </p>
                          <p className="text-sm text-slate-400 italic">
                            Analyse: {ev.clue}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="solve" className="flex-1 mt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Wer ist der Hauptverdächtige?</h3>
                    <div className="grid gap-4">
                      {activeCase.suspects.map((suspect, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="h-auto p-4 justify-start text-left border-slate-700 hover:bg-indigo-900/30 hover:text-indigo-200 hover:border-indigo-500"
                          onClick={() => solveCase(suspect.isGuilty, suspect.reason)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-500">?</div>
                            <div>
                                <div className="font-bold text-lg">{suspect.name}</div>
                                <div className="text-xs text-slate-500">Verdächtiger #{idx + 1}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {(gameStep === "solved" || gameStep === "failed") && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
                 {gameStep === "solved" ? (
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                 ) : (
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-4">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                 )}
                 
                 <h3 className={`text-3xl font-bold ${gameStep === "solved" ? "text-green-400" : "text-red-400"}`}>
                    {gameStep === "solved" ? "FALL GELÖST!" : "FALSCHER VERDACHT"}
                 </h3>
                 
                 <p className="text-xl text-slate-300 max-w-md mx-auto">
                    {feedback}
                 </p>

                 <div className="flex gap-4 pt-6">
                    <Button onClick={resetGame} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        Zurück zur Übersicht
                    </Button>
                    {gameStep === "failed" && (
                        <Button onClick={() => setGameStep("investigation")} className="bg-indigo-600 hover:bg-indigo-700">
                            Ermittlung fortsetzen
                        </Button>
                    )}
                 </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar / Tools Panel */}
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-slate-300">
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-indigo-400">Detektiv-Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-black/40 p-3 rounded font-mono text-xs text-green-500 border border-slate-800">
                        {">"} SYSTEM STATUS: ONLINE<br/>
                        {">"} NEURAL NET: CONNECTED<br/>
                        {">"} ENCRYPTION: ACTIVE
                    </div>
                    <p className="text-xs text-slate-500">
                        Nutze die Beweismittel, um Muster zu erkennen. Nicht alle Daten sind relevant für den Fall.
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-indigo-950/30 border-indigo-900/50 text-indigo-200">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                         <img alt="Dino Detektiv" src={dinoDetective} className="w-6 h-6" /> Tipp vom Dino
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm italic">
                        "Echte KI-Detektive prüfen immer die Quellen! Achte auf Zeitstempel und User-IDs."
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};