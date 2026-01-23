import React, { useEffect, useRef } from 'react';

// Types for our game entities
interface Entity {
  x: number;
  y: number;
}

interface Player extends Entity {
  speed: number;
  step: number;
}

interface NPC extends Entity {
  role: string;
  dialog: string;
  bob: number;
}

interface Building extends Entity {
  w: number;
  h: number;
}

const DigitalDeception: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Game Constants & State (Moved inside useEffect to ensure fresh instance) ---
    const WORLD = { top: 220, bottom: 560, left: 30, right: 870 };
    const keys: { [key: string]: boolean } = {};
    let dialog: string | null = null;
    let lastInteract = 0;

    const player: Player = { x: 200, y: 350, speed: 2, step: 0 };
    
    const npcDialog = {
      Finance: "Bitte prüfe Rechnungen immer doppelt, besonders bei Zeitdruck.",
      HR: "Ungewöhnliche Anfragen zu Mitarbeiterdaten immer verifizieren."
    };

    const buildings: Building[] = [];
    const npcs: NPC[] = [];

    // --- Helper Functions ---
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);

    // --- Initialization ---
    function buildCity() {
      const positions = [
        { x: 80, y: 250 }, { x: 200, y: 250 }, { x: 320, y: 250 }, { x: 440, y: 250 },
        { x: 100, y: 400 }, { x: 240, y: 400 }, { x: 380, y: 400 }, { x: 520, y: 400 }
      ];
      positions.forEach(p => {
        buildings.push({ x: p.x, y: p.y, w: 90, h: 70 });
      });
      npcs.push({ x: 430, y: 360, role: "Finance", dialog: npcDialog.Finance, bob: 0 });
      npcs.push({ x: 520, y: 360, role: "HR", dialog: npcDialog.HR, bob: 1 });
    }

    // --- Drawing Functions ---
    function drawBackground() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "#1b2733";
      ctx.fillRect(0, 0, canvas.width, WORLD.top);
      ctx.fillStyle = "#2f5d46";
      ctx.fillRect(0, WORLD.top, canvas.width, WORLD.bottom - WORLD.top);
    }

    function drawRoad() {
      if (!ctx) return;
      const roadY = 330;
      const roadH = 70;

      /* Asphalt */
      ctx.fillStyle = "#2b2f36";
      ctx.fillRect(WORLD.left, roadY, WORLD.right - WORLD.left, roadH);

      /* Gehsteige */
      ctx.fillStyle = "#6c7784";
      ctx.fillRect(WORLD.left, roadY - 10, WORLD.right - WORLD.left, 10);
      ctx.fillRect(WORLD.left, roadY + roadH, WORLD.right - WORLD.left, 10);

      /* Mittellinie */
      ctx.fillStyle = "#9aa3ad";
      for (let x = WORLD.left + 10; x < WORLD.right; x += 40) {
        ctx.fillRect(x, roadY + roadH / 2 - 2, 20, 4);
      }
    }

    function drawBuilding(b: Building) {
      if (!ctx) return;
      ctx.fillStyle = "#3a4654";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "#2a3440";
      ctx.fillRect(b.x, b.y, b.w, 12);
      ctx.fillStyle = "#9dd6ff";
      for (let y = b.y + 20; y < b.y + b.h - 15; y += 18) {
        for (let x = b.x + 10; x < b.x + b.w - 20; x += 20) {
          ctx.fillRect(x, y, 12, 8);
        }
      }
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(b.x + b.w / 2, b.y + b.h + 6, b.w * 0.4, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPerson(x: number, y: number, v: { bob: number, role?: string }) {
      if (!ctx) return;
      const bob = Math.sin(v.bob) * 0.8;
      ctx.fillStyle = "#e0ac69";
      ctx.fillRect(x - 4, y - 10 + bob, 8, 8);
      ctx.fillStyle = "#415b76";
      ctx.fillRect(x - 5, y - 2 + bob, 10, 8);
      
      if (v.role) {
        ctx.fillStyle = "rgba(11,16,22,0.75)";
        ctx.fillRect(x - 18, y - 26, 36, 10);
        ctx.fillStyle = "#e5e7eb";
        // Ensure font is set before drawing text
        ctx.font = "13px Arial";
        ctx.fillText(v.role, x - 16, y - 18);
      }
    }

    function movePlayer() {
      let dx = 0, dy = 0;
      if (keys.w || keys.ArrowUp) dy--;
      if (keys.s || keys.ArrowDown) dy++;
      if (keys.a || keys.ArrowLeft) dx--;
      if (keys.d || keys.ArrowRight) dx++;

      if (dx || dy) {
        const l = Math.hypot(dx, dy) || 1;
        player.x += dx / l * player.speed;
        player.y += dy / l * player.speed;
        player.step += 0.3;
      }
      player.x = clamp(player.x, WORLD.left + 10, WORLD.right - 10);
      player.y = clamp(player.y, WORLD.top + 20, WORLD.bottom - 14);
    }

    // --- Input Handling ---
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      
      // Interaction logic
      if (e.key === "e" || e.key === "E") {
        const now = performance.now();
        if (now - lastInteract < 150) return;
        lastInteract = now;
        dialog = null;
        for (const n of npcs) {
          if (dist(n.x, n.y, player.x, player.y) < 26) {
            dialog = n.dialog;
            break;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    // --- Main Loop ---
    function loop() {
      if (!ctx || !canvas) return;

      // Clear Screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw World
      drawBackground();
      drawRoad();
      buildings.forEach(drawBuilding);
      
      // Draw NPCs
      npcs.forEach(n => {
        n.bob += 0.05;
        drawPerson(n.x, n.y, n);
      });

      // Update & Draw Player
      movePlayer();
      drawPerson(player.x, player.y, { bob: player.step });

      // Draw Dialog UI
      if (dialog) {
        ctx.fillStyle = "rgba(11,16,22,0.9)";
        ctx.fillRect(160, 90, 580, 60);
        ctx.fillStyle = "#e5e7eb";
        ctx.font = "13px Arial"; // Ensure font is set
        ctx.fillText(dialog, 180, 125);
      }

      requestRef.current = requestAnimationFrame(loop);
    }

    // --- Startup ---
    buildCity();
    
    // Set initial font
    ctx.font = "13px Arial";

    // Attach listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start loop
    requestRef.current = requestAnimationFrame(loop);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Wrapper style to match the original body background
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f141a] text-[#e5e7eb] font-sans p-4">
      <h2 className="text-2xl font-bold mb-4">Digital Deception</h2>
      <div className="text-sm opacity-95 mb-4">
        WASD / Pfeiltasten bewegen · E = mit Person sprechen
      </div>
      
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className="block border-2 border-[#2c3e50] bg-[#0b1016] pixelated max-w-full h-auto"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default DigitalDeception;