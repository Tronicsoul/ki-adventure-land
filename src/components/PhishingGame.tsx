import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, AlertTriangle, CheckCircle2, XCircle, 
  Clock, Zap, Star, Trophy, Mail, Globe, Gift, 
  MessageSquare, ChevronRight, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import dinoDetective from "@/assets/dino-detective.png";
import dinoCelebrating from "@/assets/dino-celebrating.png";
import dinoTeaching from "@/assets/dino-teaching.png";

// Types
interface PhishingQuestion {
  id: string;
  category: "email" | "login" | "contest" | "message";
  content: {
    sender?: string;
    subject?: string;
    body: string;
    url?: string;
    company?: string;
  };
  isPhishing: boolean;
  explanation: string;
  redFlags?: string[];
  difficulty: 1 | 2 | 3;
}

// Game questions database
const phishingQuestions: PhishingQuestion[] = [
  // Emails
  {
    id: "email1",
    category: "email",
    content: {
      sender: "security@amaz0n-support.com",
      subject: "⚠️ DRINGEND: Ihr Konto wurde gesperrt!",
      body: "Sehr geehrter Kunde,\n\nWir haben verdächtige Aktivitäten festgestellt. Klicken Sie SOFORT auf den Link unten, um Ihr Konto zu verifizieren, sonst wird es dauerhaft gelöscht!\n\n→ Jetzt verifizieren",
      url: "http://amaz0n-verify.suspicious-site.com/login"
    },
    isPhishing: true,
    explanation: "Die Domain 'amaz0n-support.com' ist gefälscht (mit einer 0 statt o). Echte Amazon-Mails kommen von @amazon.de. Dringende Drohungen sind typische Phishing-Taktiken.",
    redFlags: ["Gefälschte Domain mit 0 statt O", "Dringende Drohung", "Verdächtige URL"],
    difficulty: 1
  },
  {
    id: "email2",
    category: "email",
    content: {
      sender: "noreply@paypal.com",
      subject: "Ihre Zahlungsbestätigung",
      body: "Hallo Max Mustermann,\n\nSie haben erfolgreich 25,99 € an Netflix GmbH gesendet.\n\nTransaktions-ID: PP-2024-789456\nDatum: 15. März 2024\n\nBei Fragen zu dieser Transaktion besuchen Sie paypal.com/hilfe",
      url: "https://www.paypal.com/myaccount"
    },
    isPhishing: false,
    explanation: "Diese E-Mail hat legitime Merkmale: Offizielle @paypal.com Domain, persönliche Anrede, konkrete Transaktionsdetails und verweist auf die echte PayPal-Website.",
    difficulty: 2
  },
  {
    id: "email3",
    category: "email",
    content: {
      sender: "gewinn@lotto-millionen.de",
      subject: "🎉 Sie haben 500.000€ gewonnen!!!",
      body: "HERZLICHEN GLÜCKWUNSCH!!!\n\nSie wurden zufällig ausgewählt und haben 500.000€ gewonnen!\n\nUm Ihren Gewinn zu erhalten, überweisen Sie bitte 50€ Bearbeitungsgebühr an:\nIBAN: DE89 3704 0044 0532 0130 00",
      url: "http://lotto-millionen.de/gewinn"
    },
    isPhishing: true,
    explanation: "Klassischer Vorschussbetrug! Echte Lotterien verlangen niemals Vorabgebühren. Übertriebene Gewinnsummen und Ausrufezeichen sind Warnsignale.",
    redFlags: ["Vorabgebühr verlangt", "Zu gut um wahr zu sein", "Übertriebene Formatierung"],
    difficulty: 1
  },
  // Login Pages
  {
    id: "login1",
    category: "login",
    content: {
      company: "Microsoft",
      body: "Melden Sie sich bei Ihrem Microsoft-Konto an",
      url: "https://login.microsoftonline.com/common/oauth2/authorize"
    },
    isPhishing: false,
    explanation: "Dies ist die echte Microsoft-Login-Seite. Die URL 'microsoftonline.com' ist eine offizielle Microsoft-Domain für Authentifizierung.",
    difficulty: 2
  },
  {
    id: "login2",
    category: "login",
    content: {
      company: "Google",
      body: "Anmelden\nE-Mail oder Telefonnummer eingeben",
      url: "http://google-login.account-verify.net/signin"
    },
    isPhishing: true,
    explanation: "Die Domain 'account-verify.net' ist nicht von Google! Echte Google-Logins sind nur auf google.com oder accounts.google.com. Auch das fehlende HTTPS ist verdächtig.",
    redFlags: ["Falsche Domain", "HTTP statt HTTPS", "Verdächtige Subdomain"],
    difficulty: 1
  },
  {
    id: "login3",
    category: "login",
    content: {
      company: "LinkedIn",
      body: "Willkommen zurück\nE-Mail und Passwort eingeben",
      url: "https://www.linkedin.com/login"
    },
    isPhishing: false,
    explanation: "Die offizielle LinkedIn-Domain mit HTTPS-Verschlüsselung. Die URL-Struktur ist korrekt und zeigt auf die echte Anmeldeseite.",
    difficulty: 2
  },
  // Contests
  {
    id: "contest1",
    category: "contest",
    content: {
      company: "Apple",
      subject: "iPhone 15 Pro GRATIS!",
      body: "HERZLICHEN GLÜCKWUNSCH! Sie sind der 1.000.000ste Besucher!\n\n🎁 Klicken Sie hier um Ihr GRATIS iPhone 15 Pro zu erhalten!\n\nNur heute verfügbar - nur 3 übrig!",
      url: "http://free-iphone-winner.com/claim"
    },
    isPhishing: true,
    explanation: "Typischer Pop-up-Betrug! Apple verschenkt keine iPhones an 'zufällige Besucher'. Künstliche Dringlichkeit ('nur 3 übrig') ist ein Manipulationstrick.",
    redFlags: ["Unrealistisches Gratisangebot", "Künstliche Verknappung", "Nicht-Apple-Domain"],
    difficulty: 1
  },
  {
    id: "contest2",
    category: "contest",
    content: {
      company: "REWE",
      subject: "Umfrage-Teilnahme",
      body: "Lieber Kunde,\n\nVielen Dank für Ihren Einkauf bei REWE. Nehmen Sie an unserer kurzen Kundenzufriedenheitsumfrage teil.\n\nAls Dankeschön erhalten Sie 5€ Rabatt auf Ihren nächsten Einkauf.",
      url: "https://www.rewe.de/service/kundenbefragung"
    },
    isPhishing: false,
    explanation: "Realistisches Angebot von einer echten Firma. Der Rabatt ist angemessen, die Domain ist korrekt, und Kundenbefragungen sind übliche Praxis.",
    difficulty: 3
  },
  // Messages
  {
    id: "message1",
    category: "message",
    content: {
      sender: "+49 176 *** ** 89",
      body: "Hallo Papa! Mein Handy ist kaputt. Das ist meine neue Nummer. Kannst du mir schnell 500€ auf dieses Konto überweisen? Ich erklär dir später alles! 🙏",
    },
    isPhishing: true,
    explanation: "Der 'Enkeltrick' in moderner Form! Betrüger geben sich als Familienmitglieder aus. Immer erst über die bekannte Nummer zurückrufen!",
    redFlags: ["Neue unbekannte Nummer", "Dringende Geldforderung", "Keine Erklärung"],
    difficulty: 1
  },
  {
    id: "message2",
    category: "message",
    content: {
      sender: "DHL",
      body: "Ihr Paket konnte nicht zugestellt werden. Bitte zahlen Sie 1,99€ Zollgebühr unter: https://dhl-paket-de.tracking.com/zoll",
    },
    isPhishing: true,
    explanation: "Gefälschte DHL-SMS! Die Domain 'dhl-paket-de.tracking.com' ist nicht von DHL. Echte DHL-Nachrichten verlinken auf dhl.de.",
    redFlags: ["Gefälschte Domain", "Kleine Geldforderung als Köder", "Unangekündigtes Paket"],
    difficulty: 2
  },
  {
    id: "message3",
    category: "message",
    content: {
      sender: "Sparkasse",
      body: "Ihre pushTAN-Registrierung läuft ab. Verlängern Sie jetzt in der Sparkassen-App oder unter sparkasse.de/tan",
    },
    isPhishing: false,
    explanation: "Legitime Erinnerung mit korrekter Domain (sparkasse.de). Keine verdächtigen Links oder Geldforderungen.",
    difficulty: 3
  },
];

// Story steps
const storySteps = [
  {
    dinoImage: dinoDetective,
    title: "Willkommen im Cyber-Dschungel!",
    message: "Hey! Ich bin Dino, dein Guide durch den gefährlichen Cyber-Dschungel. Hier lauern überall Fallen – Phishing-Angriffe, die deine Daten stehlen wollen!",
  },
  {
    dinoImage: dinoTeaching,
    title: "Deine Mission",
    message: "Deine Aufgabe: Erkenne welche Nachrichten echt sind und welche Phishing-Versuche! Je schneller du entscheidest, desto mehr Punkte gibt's. Bist du bereit?",
  },
];

// Category icons
const categoryIcons = {
  email: Mail,
  login: Globe,
  contest: Gift,
  message: MessageSquare,
};

const categoryNames = {
  email: "E-Mail",
  login: "Login-Seite",
  contest: "Gewinnspiel",
  message: "Nachricht",
};

interface PhishingGameProps {
  onClose?: () => void;
}

const PhishingGame = ({ onClose }: PhishingGameProps) => {
  // Game state
  const [gamePhase, setGamePhase] = useState<"story" | "playing" | "feedback" | "results">("story");
  const [storyStep, setStoryStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<PhishingQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; points: number } | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; timeBonus: boolean }[]>([]);

  // Initialize game questions
  const initializeGame = useCallback(() => {
    const shuffled = [...phishingQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 8));
    setCurrentQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAnswers([]);
    setTimeLeft(15);
  }, []);

  // Start the game
  const startGame = () => {
    initializeGame();
    setGamePhase("playing");
    setIsTimerRunning(true);
  };

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || gamePhase !== "playing") return;
    
    if (timeLeft <= 0) {
      handleAnswer(null); // Time's up, count as wrong
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, gamePhase]);

  // Handle answer
  const handleAnswer = (userAnswer: boolean | null) => {
    setIsTimerRunning(false);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.isPhishing;
    
    // Calculate points
    let points = 0;
    let timeBonus = false;
    
    if (isCorrect) {
      const basePoints = currentQuestion.difficulty * 100;
      const timeBonusPoints = timeLeft > 10 ? 50 : timeLeft > 5 ? 25 : 0;
      const comboMultiplier = 1 + (combo * 0.1);
      points = Math.round((basePoints + timeBonusPoints) * comboMultiplier);
      timeBonus = timeBonusPoints > 0;
      
      setScore(prev => prev + points);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
    } else {
      setCombo(0);
    }

    setLastAnswer({ correct: isCorrect, points });
    setAnswers(prev => [...prev, { correct: isCorrect, timeBonus }]);
    setGamePhase("feedback");
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setGamePhase("results");
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(15);
      setGamePhase("playing");
      setIsTimerRunning(true);
    }
  };

  // Restart game
  const restartGame = () => {
    setStoryStep(0);
    setGamePhase("story");
    initializeGame();
  };

  // Calculate stars
  const getStars = () => {
    const correctAnswers = answers.filter(a => a.correct).length;
    const percentage = (correctAnswers / questions.length) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  // Get result message
  const getResultMessage = () => {
    const stars = getStars();
    const messages = [
      "Noch etwas Übung nötig! Der Cyber-Dschungel ist tückisch.",
      "Guter Start! Du erkennst schon einige Fallen.",
      "Sehr gut! Du wirst zum echten Phishing-Experten!",
      "Perfekt! Du bist ein wahrer Cyber-Held!"
    ];
    return messages[stars];
  };

  const currentQuestion = questions[currentQuestionIndex];
  const CategoryIcon = currentQuestion ? categoryIcons[currentQuestion.category] : Mail;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Story Phase */}
      <AnimatePresence mode="wait">
        {gamePhase === "story" && (
          <motion.div
            key="story"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-3xl shadow-card p-8 text-center"
          >
            <motion.img
              src={storySteps[storyStep].dinoImage}
              alt="Dino Guide"
              className="w-32 h-32 mx-auto mb-6 object-contain"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.h2
              className="text-2xl font-display font-bold text-foreground mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {storySteps[storyStep].title}
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-8 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {storySteps[storyStep].message}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {storyStep < storySteps.length - 1 ? (
                <Button
                  onClick={() => setStoryStep(prev => prev + 1)}
                  variant="playful"
                  size="lg"
                  className="group"
                >
                  Weiter
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  onClick={startGame}
                  variant="playful"
                  size="lg"
                  className="group"
                >
                  <Shield className="w-5 h-5" />
                  Mission starten!
                </Button>
              )}
            </motion.div>
            
            {/* Story progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {storySteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === storyStep ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Playing Phase */}
        {gamePhase === "playing" && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* Header with stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-card rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold text-foreground">{score}</span>
                </div>
                {combo > 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-accent/20 rounded-2xl px-3 py-1 flex items-center gap-1"
                  >
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm font-bold text-accent">x{combo} Combo!</span>
                  </motion.div>
                )}
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
                timeLeft <= 5 ? "bg-destructive/20" : "bg-card"
              }`}>
                <Clock className={`w-5 h-5 ${timeLeft <= 5 ? "text-destructive" : "text-muted-foreground"}`} />
                <span className={`font-display font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Frage {currentQuestionIndex + 1} von {questions.length}</span>
                <span>{answers.filter(a => a.correct).length} richtig</span>
              </div>
              <Progress 
                value={((currentQuestionIndex + 1) / questions.length) * 100} 
                className="h-3"
              />
            </div>

            {/* Question Card */}
            <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-6">
              {/* Category header */}
              <div className="bg-secondary/50 px-6 py-3 flex items-center gap-2">
                <CategoryIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-secondary-foreground">
                  {categoryNames[currentQuestion.category]}
                </span>
                <div className="ml-auto flex gap-1">
                  {[1, 2, 3].map(level => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= currentQuestion.difficulty ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content based on category */}
              <div className="p-6">
                {currentQuestion.category === "email" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {currentQuestion.content.sender}
                        </p>
                        <p className="text-xs text-muted-foreground">An: du@firma.de</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <h4 className="font-display font-bold text-foreground mb-2">
                        {currentQuestion.content.subject}
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {currentQuestion.content.body}
                      </p>
                      {currentQuestion.content.url && (
                        <div className="mt-4 p-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground font-mono break-all">
                            🔗 {currentQuestion.content.url}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentQuestion.category === "login" && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                      <Globe className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-display font-bold text-foreground mb-2">
                      {currentQuestion.content.company}
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      {currentQuestion.content.body}
                    </p>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        🔗 {currentQuestion.content.url}
                      </p>
                    </div>
                  </div>
                )}

                {currentQuestion.category === "contest" && (
                  <div className="text-center py-4">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h4 className="font-display font-bold text-foreground mb-2">
                      {currentQuestion.content.subject}
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">
                      {currentQuestion.content.body}
                    </p>
                    {currentQuestion.content.url && (
                      <div className="mt-4 p-2 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground font-mono break-all">
                          🔗 {currentQuestion.content.url}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {currentQuestion.category === "message" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {currentQuestion.content.sender}
                      </p>
                    </div>
                    <div className="bg-secondary/30 rounded-2xl p-4">
                      <p className="text-foreground whitespace-pre-line">
                        {currentQuestion.content.body}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                variant="outline"
                size="lg"
                className="h-16 border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive group"
              >
                <AlertTriangle className="w-6 h-6 mr-2 text-destructive" />
                <span className="font-display font-bold">Phishing!</span>
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                size="lg"
                className="h-16 border-2 border-accent/30 hover:bg-accent/10 hover:border-accent group"
              >
                <CheckCircle2 className="w-6 h-6 mr-2 text-accent" />
                <span className="font-display font-bold">Echt</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Feedback Phase */}
        {gamePhase === "feedback" && currentQuestion && lastAnswer && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-3xl shadow-card p-8"
          >
            <div className="text-center mb-6">
              {lastAnswer.correct ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-accent" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-accent mb-2">
                    Richtig! +{lastAnswer.points} Punkte
                  </h3>
                  <img
                    src={dinoCelebrating}
                    alt="Dino feiert"
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center"
                  >
                    <XCircle className="w-12 h-12 text-destructive" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-destructive mb-2">
                    Nicht ganz richtig
                  </h3>
                  <img
                    src={dinoTeaching}
                    alt="Dino erklärt"
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </>
              )}
            </div>

            <div className="bg-secondary/30 rounded-2xl p-4 mb-6">
              <p className="text-sm text-foreground mb-2 font-semibold">
                {currentQuestion.isPhishing ? "🚨 Das war Phishing!" : "✅ Das war echt!"}
              </p>
              <p className="text-muted-foreground text-sm">
                {currentQuestion.explanation}
              </p>
              {currentQuestion.redFlags && currentQuestion.redFlags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentQuestion.redFlags.map((flag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full"
                    >
                      ⚠️ {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={nextQuestion}
              variant="playful"
              size="lg"
              className="w-full"
            >
              {currentQuestionIndex + 1 >= questions.length ? (
                <>
                  <Trophy className="w-5 h-5" />
                  Ergebnisse ansehen
                </>
              ) : (
                <>
                  Nächste Frage
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Results Phase */}
        {gamePhase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-3xl shadow-card p-8 text-center"
          >
            <img
              src={getStars() >= 2 ? dinoCelebrating : dinoTeaching}
              alt="Dino"
              className="w-28 h-28 mx-auto mb-6 object-contain"
            />

            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              Mission abgeschlossen!
            </h2>
            
            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2, type: "spring" }}
                >
                  <Star
                    className={`w-12 h-12 ${
                      i <= getStars()
                        ? "text-primary fill-primary"
                        : "text-border"
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground mb-6">{getResultMessage()}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary/30 rounded-2xl p-4">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{score}</p>
                <p className="text-xs text-muted-foreground">Punkte</p>
              </div>
              <div className="bg-secondary/30 rounded-2xl p-4">
                <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">
                  {answers.filter(a => a.correct).length}/{questions.length}
                </p>
                <p className="text-xs text-muted-foreground">Richtig</p>
              </div>
              <div className="bg-secondary/30 rounded-2xl p-4">
                <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">x{maxCombo}</p>
                <p className="text-xs text-muted-foreground">Max Combo</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={restartGame}
                variant="playful"
                size="lg"
                className="flex-1"
              >
                <RotateCcw className="w-5 h-5" />
                Nochmal spielen
              </Button>
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Zurück zur Übersicht
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhishingGame;
