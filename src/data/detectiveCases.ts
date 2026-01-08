export type Evidence = {
  id: string;
  type: "text" | "image" | "location";
  content: string;
  clue: string;
};

export type Case = {
  id: number;
  title: string;
  difficulty: "Einfach" | "Mittel" | "Schwer";
  description: string;
  missionBrief: string;
  evidence: Evidence[];
  suspects: {
    name: string;
    isGuilty: boolean;
    reason: string;
  }[];
};

export const detectiveCases: Case[] = [
  {
    id: 1,
    title: "Das verschwundene KI-Modell",
    difficulty: "Einfach",
    description: "Ein wichtiges Sprachmodell wurde aus dem Labor gestohlen. Wer hatte Zugriff?",
    missionBrief: "Detektiv! Jemand hat unser neustes KI-Modell 'NeuroBot 9000' auf einen privaten Server kopiert. Analysiere die Server-Logs und finde den Täter.",
    evidence: [
      {
        id: "e1",
        type: "text",
        content: "Server-Log 23:00 Uhr: Zugriff durch User ID #4492 (Admin-Rechte)",
        clue: "Der Zugriff geschah spät nachts."
      },
      {
        id: "e2",
        type: "location",
        content: "GPS Daten User #4492: Café 'CyberBean', Innenstadt.",
        clue: "Der User war nicht im Büro."
      },
      {
          id: "text",
          content: "Chat-Protokoll: 'Habe die Daten sicher. Überweisung erwartet.' - Absender unbekannt.",
          clue: "Es gab ein finanzielles Motiv.",
          type: "text"
      }
    ],
    suspects: [
      {
        name: "Dr. Glitch",
        isGuilty: true,
        reason: "Richtig! Seine ID passt zu den Logs und er braucht Geld für seine Roboter-Katzen."
      },
      {
        name: "Praktikant Pixel",
        isGuilty: false,
        reason: "Falsch. Pixel war zur Tatzeit in einem Gaming-Turnier live gestreamt."
      }
    ]
  },
  {
    id: 2,
    title: "Die manipulierte Playlist",
    difficulty: "Mittel",
    description: "Der Algorithmus spielt nur noch Polka-Musik. Ein Hack?",
    missionBrief: "Unsere Musik-KI spielt verrückt. Analysiere den Code und finde heraus, wer den Algorithmus biased (voreingenommen) gemacht hat.",
    evidence: [
      {
        id: "e1",
        type: "text",
        content: "Commit History: 'Update des Empfehlungs-Algorithmus' durch User 'PolkaKing'.",
        clue: "Der Username ist ein starker Hinweis."
      },
      {
          id: "text",
          content: "Code-Snippet: if (genre != 'Polka') { probability = 0; }",
          clue: "Der Code erzwingt ein Genre.",
          type: "location"
      }
    ],
    suspects: [
      {
        name: "DJ Data",
        isGuilty: false,
        reason: "DJ Data hasst Polka. Er ist unschuldig."
      },
      {
        name: "Hans Akkordeon",
        isGuilty: true,
        reason: "Treffer! Er wollte sein neues Album pushen."
      }
    ]
  }
];