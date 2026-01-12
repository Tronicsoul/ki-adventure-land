import React, { useState, useEffect } from 'react';

const DetectiveStory = () => {
    // --- State Management ---
    const [foundClues, setFoundClues] = useState([]); // Array of clue IDs
    const [hintsEnabled, setHintsEnabled] = useState(false);
    const [verdict, setVerdict] = useState(null); // 'safe' | 'scam'
    const [modalState, setModalState] = useState({ active: false, title: '', body: '', color: '' });
    
    // Wheel State
    const [wheelState, setWheelState] = useState({ 
        active: false, 
        x: 0, 
        y: 0, 
        activeZoneId: null, 
        shake: false,
        wrongBtnIndex: null // To track which button was wrong for styling
    });

    // Tooltip Fade Out State
    const [fadingTooltips, setFadingTooltips] = useState(new Set());

    // --- Constants & Data ---
    const totalClues = 5;
    
    // Position mappings matching the original CSS nth-child logic
    const wheelOptions = [
        { label: 'Fake-Domain', reason: 'spoofed-domain', pos: { x: 0, y: -85 } }, // Top
        { label: 'Formatierung', reason: 'formatting-error', pos: { x: 77, y: -50 } }, // Top Right
        { label: 'Schad-Link', reason: 'malicious-link', pos: { x: 95, y: 0 } }, // Right
        { label: 'Dringlichkeit', reason: 'urgency', pos: { x: 77, y: 50 } }, // Bottom Right
        { label: 'Allg. Anrede', reason: 'generic-greeting', pos: { x: 0, y: 85 } }, // Bottom
        { label: 'KI-Stil', reason: 'ai-syntax', pos: { x: -77, y: 50 } }, // Bottom Left
        { label: 'Logikfehler', reason: 'logic-error', pos: { x: -95, y: 0 } }, // Left
        { label: 'Datenabfrage', reason: 'data-request', pos: { x: -77, y: -50 } }, // Top Left
    ];

    const evidenceList = [
        { id: 'spoofed-domain', text: 'Gefälschte Domain' },
        { id: 'ai-syntax', text: 'Unnatürlicher Stil' },
        { id: 'malicious-link', text: 'Schädlicher Link' },
        { id: 'logic-error', text: 'Veraltetes Copyright' },
        { id: 'urgency', text: 'Dringlichkeit' },
    ];

    // --- Logic ---

    // XP Calculation based on original app.js
    const getArtificialityScore = () => {
        const percentage = Math.min(Math.round((foundClues.length / totalClues) * 98), 98);
        let color = 'var(--accent-success)';
        if (percentage > 70) color = 'var(--accent-danger)';
        else if (percentage > 40) color = 'var(--accent-warning)';
        return { percentage, color };
    };

    // Handlers
    const handleZoneClick = (e, id) => {
        e.stopPropagation();
        // Prevent default if it's a link or inside a link
        if (e.target.tagName === 'A') e.preventDefault();
        
        if (foundClues.includes(id)) return;

        setWheelState({
            active: true,
            x: e.clientX,
            y: e.clientY,
            activeZoneId: id,
            shake: false,
            wrongBtnIndex: null
        });
    };

    const closeWheel = () => {
        setWheelState(prev => ({ ...prev, active: false, activeZoneId: null }));
    };

    const handleWheelOptionClick = (e, selectedReason, index) => {
        e.stopPropagation();
        if (!wheelState.activeZoneId) return;

        const correctReason = wheelState.activeZoneId;

        if (selectedReason === correctReason) {
            // Correct Choice
            const newFoundClues = [...foundClues, correctReason];
            setFoundClues(newFoundClues);
            
            // Trigger fade out timer for tooltip (5 seconds as per original)
            setTimeout(() => {
                setFadingTooltips(prev => {
                    const next = new Set(prev);
                    next.add(correctReason);
                    return next;
                });
            }, 5000);

            closeWheel();
        } else {
            // Wrong Choice
            setWheelState(prev => ({ ...prev, shake: true, wrongBtnIndex: index }));
            
            // Remove shake/wrong class after animation
            setTimeout(() => {
                setWheelState(prev => ({ ...prev, shake: false, wrongBtnIndex: null }));
            }, 400);
        }
    };

    const handleSubmit = () => {
        if (!verdict) {
            alert("Bitte wählen Sie ein Urteil (Legitim oder Schädlich), bevor Sie senden.");
            return;
        }

        const cluesCount = foundClues.length;
        const BASE_XP = 150;
        const XP_PER_CLUE = 40;
        const totalXP = BASE_XP + (cluesCount * XP_PER_CLUE);
        
        let newModalState = { active: true, title: '', body: '', color: '' };

        if (verdict === 'scam') {
            newModalState.title = "FALL GELÖST";
            newModalState.color = "var(--accent-success)";
            
            if (cluesCount === totalClues) {
                newModalState.body = `Perfekte Punktzahl! Sie haben alle <strong>${totalClues}</strong> Hinweise gefunden.<br><br>
                Basis-Belohnung: +${BASE_XP}<br>
                Hinweis-Bonus: +${cluesCount * XP_PER_CLUE}<br>
                <strong>Gesamt verdient: +${totalXP} XP</strong>`;
            } else {
                newModalState.body = `Gute Arbeit! Sie haben die Bedrohung erkannt, aber <strong>${totalClues - cluesCount}</strong> Hinweise übersehen.<br><br>
                Basis-Belohnung: +${BASE_XP}<br>
                Hinweis-Bonus: +${cluesCount * XP_PER_CLUE}<br>
                <strong>Gesamt verdient: +${totalXP} XP</strong>`;
            }
        } else {
            newModalState.title = "SICHERHEITSVERLETZUNG";
            newModalState.color = "var(--accent-danger)";
            newModalState.body = "Sie haben eine bösartige E-Mail als sicher eingestuft. Die Ransomware wurde ausgeführt.<br><br><strong>Verdiente XP: 0</strong>";
        }
        
        setModalState(newModalState);
    };

    // Close wheel on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wheelState.active) {
                closeWheel();
            }
        };
        // Use capture phase to ensure it runs before other handlers if needed, 
        // though standard bubble is fine here as long as wheel click stops prop.
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [wheelState.active]);

    const scoreData = getArtificialityScore();


    // --- Helper Component for Zones ---
    const SuspiciousZone = ({ id, children, tooltipTitle, tooltipText, style }) => {
        const isFound = foundClues.includes(id);
        const isFading = fadingTooltips.has(id);
        
        return (
            <span 
                className={`suspicious-zone ${isFound ? 'found' : ''}`} 
                data-id={id}
                onClick={(e) => handleZoneClick(e, id)}
                style={style}
            >
                {children}
                {isFound && (
                    <span className={`analysis-tooltip ${isFading ? 'fade-out' : ''}`}>
                        <span className="tooltip-tag">{tooltipTitle}</span>
                        {tooltipText}
                    </span>
                )}
            </span>
        );
    };

    return (
        <div className="app-container">
            {/* Inject Original CSS */}
            <style>{`
                /* --- RESET & VARIABLES --- */
                .app-container * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                }

                .app-container {
                    /* Palette: Cyber Tactical B2B */
                    --bg-dark: #0f172a;
                    --panel-bg: #1e293b;
                    --panel-border: #334155;
                    --text-main: #f8fafc;
                    --text-muted: #94a3b8;
                    
                    /* Game Accents */
                    --accent-primary: #3b82f6; /* Blue for UI */
                    --accent-warning: #f59e0b; /* Yellow for Suspicion */
                    --accent-danger: #ef4444; /* Red for Threat/Scam */
                    --accent-success: #22c55e; /* Green for Safe/Verified */
                    --highlight-bg: rgba(245, 158, 11, 0.2); /* Low opacity yellow */
                    
                    --radius-md: 8px;
                    --radius-lg: 12px;
                    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3);

                    background-color: var(--bg-dark);
                    color: var(--text-main);
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden; /* Prevent scroll for dashboard feel */
                    position: relative;
                }

                /* --- HEADER & GAMIFICATION BAR --- */
                .app-container header {
                    background-color: var(--panel-bg);
                    border-bottom: 1px solid var(--panel-border);
                    padding: 0.75rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 70px;
                    flex-shrink: 0;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    font-size: 1.2rem;
                    letter-spacing: 0.5px;
                }

                .brand-icon {
                    width: 32px;
                    height: 32px;
                    background: var(--accent-primary);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }

                .player-stats {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .level-badge {
                    background: #334155;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    border: 1px solid #475569;
                }

                .level-badge span {
                    color: var(--accent-primary);
                    font-weight: bold;
                }

                .xp-container {
                    display: flex;
                    flex-direction: column;
                    width: 250px;
                    gap: 4px;
                }

                .xp-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .xp-bar {
                    height: 8px;
                    background: #334155;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .xp-fill {
                    height: 100%;
                    width: 65%;
                    background: linear-gradient(90deg, var(--accent-primary), #60a5fa);
                    border-radius: 4px;
                }

                .streak-fire {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--accent-warning);
                    font-weight: bold;
                }

                /* --- MAIN DASHBOARD LAYOUT --- */
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 240px 1fr 320px; /* Sidebar, Main Work, Details */
                    gap: 1px; /* Gap creates borders via background showing through */
                    background-color: var(--panel-border); /* Grid lines color */
                    flex: 1;
                    height: calc(100vh - 70px);
                }

                .panel {
                    background-color: var(--bg-dark);
                    padding: 20px;
                    overflow-y: auto;
                }

                .panel-sidebar {
                    background-color: var(--panel-bg);
                    border-right: 1px solid var(--panel-border);
                }

                .panel-details {
                    background-color: var(--panel-bg);
                    border-left: 1px solid var(--panel-border);
                }

                /* --- SIDEBAR TOOLS --- */
                .tool-category {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-muted);
                    margin-bottom: 12px;
                    margin-top: 20px;
                }
                .tool-category:first-child { margin-top: 0; }

                .tool-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    border: 1px solid transparent;
                    border-radius: var(--radius-md);
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                    margin-bottom: 8px;
                }

                .tool-btn:hover {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--text-main);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .tool-btn.active {
                    background: rgba(59, 130, 246, 0.2);
                    color: var(--accent-primary);
                    border-color: var(--accent-primary);
                    font-weight: 600;
                }

                .tool-btn.locked {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .icon-box {
                    width: 24px;
                    text-align: center;
                }

                /* --- MAIN WORKSPACE (The Game) --- */
                .case-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .case-id {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .case-tag {
                    background: rgba(239, 68, 68, 0.2);
                    color: var(--accent-danger);
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    border: 1px solid rgba(239, 68, 68, 0.4);
                }

                /* MODULE 1: EMAIL INVESTIGATOR */
                .investigation-card {
                    background: var(--panel-bg);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--panel-border);
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                }

                .card-header-bar {
                    background: #283445;
                    padding: 10px 20px;
                    border-bottom: 1px solid var(--panel-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                .email-mockup {
                    padding: 30px;
                    font-family: 'Arial', sans-serif;
                    background: #e2e8f0;
                    color: #1e293b;
                    min-height: 250px;
                }

                .email-meta {
                    margin-bottom: 20px;
                    border-bottom: 1px solid #cbd5e1;
                    padding-bottom: 15px;
                }

                .meta-row {
                    display: flex;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                }

                .meta-label {
                    width: 80px;
                    font-weight: bold;
                    color: #64748b;
                }

                /* GAMEPLAY: HIGHLIGHTING MECHANIC */
                .suspicious-zone {
                    position: relative;
                    border-bottom: 2px dashed transparent;
                    cursor: cell;
                    transition: all 0.2s;
                    padding: 0 2px;
                    display: inline-block;
                }
                
                div.suspicious-zone {
                    display: inline-block;
                }

                .suspicious-zone:hover {
                    background-color: rgba(245, 158, 11, 0.1);
                    border-bottom-color: rgba(245, 158, 11, 0.5);
                }

                /* State: User has clicked/found this item */
                .suspicious-zone.found {
                    background-color: rgba(239, 68, 68, 0.2);
                    border: 1px solid var(--accent-danger);
                    border-radius: 3px;
                    cursor: default;
                }

                /* Animation for finding a clue */
                @keyframes popIn {
                    0% { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
                    100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }

                .suspicious-zone.found .analysis-tooltip {
                    display: block;
                    animation: popIn 0.2s ease-out forwards;
                }

                /* FADE OUT ANIMATION for Auto-Hide */
                .suspicious-zone.found .analysis-tooltip.fade-out {
                    animation: tooltipFadeOut 1s ease forwards;
                }

                @keyframes tooltipFadeOut {
                    from { opacity: 1; pointer-events: auto; }
                    to { opacity: 0; pointer-events: none; visibility: hidden; }
                }

                /* The Tooltip showing the analysis */
                .analysis-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--bg-dark);
                    color: var(--text-main);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    white-space: nowrap;
                    box-shadow: var(--shadow-card);
                    border: 1px solid var(--accent-warning);
                    z-index: 10;
                    margin-bottom: 5px;
                    transition: opacity 0.2s ease;
                }

                .analysis-tooltip:hover {
                    opacity: 0.2; /* Ghost mode so you can see behind it */
                }

                .tooltip-tag {
                    color: var(--accent-warning);
                    font-weight: bold;
                    display: block;
                    margin-bottom: 2px;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                }


                /* --- RIGHT PANEL: VERDICT & STATS --- */
                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-md);
                    padding: 15px;
                    margin-bottom: 20px;
                }

                .stat-header {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                /* EVIDENCE LIST & HINT TOGGLE */
                .evidence-list {
                    list-style: none;
                    transition: all 0.3s ease;
                }

                .evidence-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--panel-border);
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    transition: all 0.3s ease;
                }

                .evidence-item:last-child { border-bottom: none; }

                .evidence-check {
                    color: #475569;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    border-radius: 50%;
                    border: 1px solid #475569;
                    font-size: 0.7rem;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }

                /* Active State for Evidence Sidebar */
                .evidence-item.checked {
                    color: var(--text-main);
                }

                .evidence-item.checked .evidence-check {
                    background-color: var(--accent-success);
                    border-color: var(--accent-success);
                    color: white;
                }

                /* HINT LOGIC: Blur text if hints disabled and not found */
                .evidence-list.hints-disabled .evidence-item:not(.checked) .evidence-text {
                    filter: blur(5px);
                    opacity: 0.4;
                    user-select: none;
                    transition: filter 0.3s ease, opacity 0.3s ease;
                }

                /* Toggle Switch Styles */
                .hints-toggle-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .hints-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .switch {
                    position: relative;
                    display: inline-block;
                    width: 32px;
                    height: 18px;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #334155;
                    transition: .4s;
                    border-radius: 34px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 12px;
                    width: 12px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }

                input:checked + .slider {
                    background-color: var(--accent-primary);
                }

                input:checked + .slider:before {
                    transform: translateX(14px);
                }

                /* Verdict Buttons */
                .verdict-section {
                    margin-top: 30px;
                }

                .btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }

                .btn {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: var(--radius-md);
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.1s;
                }

                .btn:active { transform: scale(0.98); }

                .btn-safe {
                    background: var(--panel-bg);
                    border: 2px solid var(--accent-success);
                    color: var(--accent-success);
                    opacity: 0.6;
                }

                .btn-safe.selected {
                    background: var(--accent-success);
                    color: white;
                    opacity: 1;
                    box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
                    position: relative;
                }

                .btn-safe.selected::after {
                    content: 'AUSGEWÄHLT';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: white;
                    color: var(--accent-success);
                    font-size: 0.6rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .btn-scam {
                    background: var(--panel-bg);
                    border: 2px solid var(--accent-danger);
                    color: var(--accent-danger);
                    opacity: 0.6;
                }

                .btn-scam.selected {
                    background: var(--accent-danger);
                    color: white;
                    opacity: 1;
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
                    position: relative;
                }

                .btn-scam.selected::after {
                    content: 'AUSGEWÄHLT';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: white;
                    color: var(--accent-danger);
                    font-size: 0.6rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                /* --- MODAL --- */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .modal-overlay.active {
                    opacity: 1;
                    pointer-events: all;
                }


                .modal-content {
                    background: var(--panel-bg);
                    border: 1px solid var(--panel-border);
                    border-radius: var(--radius-lg);
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    transform: translateY(20px);
                    transition: transform 0.3s ease;
                }

                .modal-overlay.active .modal-content {
                    transform: translateY(0);
                }

                .modal-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .modal-body {
                    color: var(--text-muted);
                    margin-bottom: 25px;
                    line-height: 1.5;
                }

                .modal-btn {
                    background: var(--accent-primary);
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: bold;
                    width: 100%;
                }

                /* --- CONTEXT WHEEL (RADIAL MENU) --- */
                .context-wheel {
                    position: fixed;
                    width: 240px;
                    height: 240px;
                    transform: translate(-50%, -50%) scale(0);
                    z-index: 999;
                    pointer-events: none;
                    opacity: 0;
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease;
                }

                .context-wheel.active {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                    pointer-events: all;
                }

                .wheel-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 44px;
                    height: 44px;
                    background: var(--bg-dark);
                    border: 2px solid var(--accent-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: var(--text-muted);
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
                    cursor: pointer;
                    z-index: 2;
                }

                .wheel-center:hover {
                    color: var(--text-main);
                    background: var(--panel-bg);
                }

                .wheel-btn {
                    position: absolute;
                    width: 90px;
                    padding: 6px 8px;
                    background: var(--panel-bg);
                    border: 1px solid var(--panel-border);
                    color: var(--text-main);
                    font-size: 0.7rem;
                    font-weight: bold;
                    border-radius: 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                    transition: all 0.2s;
                    text-align: center;
                    white-space: nowrap;
                    top: 50%;
                    left: 50%;
                    margin-top: -15px;
                    margin-left: -45px;
                }

                .wheel-btn:hover {
                    background: var(--accent-primary);
                    border-color: var(--accent-primary);
                    /* transform: scale(1.1) !important;  */
                    z-index: 10;
                }

                /* Animation Keyframes */
                @keyframes shake {
                    0% { transform: translate(-50%, -50%) translateX(0); }
                    25% { transform: translate(-50%, -50%) translateX(-10px); }
                    50% { transform: translate(-50%, -50%) translateX(10px); }
                    75% { transform: translate(-50%, -50%) translateX(-10px); }
                    100% { transform: translate(-50%, -50%) translateX(0); }
                }

                .context-wheel.shake {
                    animation: shake 0.4s ease-in-out;
                }

                .wheel-btn.wrong {
                    background: var(--accent-danger);
                    border-color: var(--accent-danger);
                }

                @media (width < 1200px) {
                    .dashboard-grid {
                        grid-template-columns: 0 1fr 320px;
                    }
                }

                .suspicious-zone a {
                    text-decoration: none;
                    color: white;
                }
            `}</style>

            {/* Top Navigation / Gamification Bar */}
            <header>
                <div className="brand">
                    <div className="brand-icon">🛡️</div>
                    <div>Digital Defense <span style={{color:'var(--text-muted)', fontWeight:400}}>Agency</span></div>
                </div>

                <div className="player-stats">
                    {/* Streak */}
                    <div className="streak-fire">
                        🔥 12 Tage Serie
                    </div>

                    {/* Level & XP */}
                    <div className="level-badge">
                        Level 3: <span>Senior Analyst</span>
                    </div>
                    <div className="xp-container">
                        <div className="xp-label">
                            <span>XP Fortschritt</span>
                            <span>850 / 1000</span>
                        </div>
                        <div className="xp-bar">
                            <div className="xp-fill"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3-Column Dashboard Layout */}
            <div className="dashboard-grid">

                {/* Left: Toolkit Sidebar */}
                <aside className="panel panel-sidebar">
                    <div className="tool-category">Standard Werkzeuge</div>
                    <button className="tool-btn active">
                        <div className="icon-box">🔍</div>
                        <span>Fall-Ermittlung</span>
                    </button>
                    <button className="tool-btn">
                        <div className="icon-box">📧</div>
                        <span>Header-Analyse</span>
                    </button>
                    
                    <div className="tool-category">Erweiterte Forensik</div>
                    <button className="tool-btn">
                        <div className="icon-box">🧠</div>
                        <span>Logik-Check</span>
                    </button>
                    <button className="tool-btn">
                        <div className="icon-box">🌍</div>
                        <span>Rückwärtssuche</span>
                    </button>
                    <button className="tool-btn">
                        <div className="icon-box">🔬</div>
                        <span>Pixel-DeepScan</span>
                    </button>
                    
                    <div className="tool-category">Gesperrt (Lvl 5+)</div>
                    <button className="tool-btn locked">
                        <div className="icon-box">🔒</div>
                        <span>Audio-Wellenform</span>
                    </button>
                </aside>

                {/* Center: The Active Case (Game View) */}
                <main className="panel">
                    <div className="case-header">
                        <div>
                            <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'4px'}}>AKTUELLES ASSIGNMENT</div>
                            <div className="case-id">Fall #4092: "Dringende Rechnung"</div>
                        </div>
                        <div className="case-tag">Potenzielles Phishing</div>
                    </div>

                    {/* GAME LOOP A: Text Investigator */}
                    <div className="tool-category">Beweismittel A: E-Mail Verlauf</div>
                    <div className="investigation-card">
                        <div className="card-header-bar">
                            <span>Outlook_Viewer_v2.exe</span>
                            <span>Bedrohungsstufe: Unbekannt</span>
                        </div>
                        <div className="email-mockup">
                            <div className="email-meta">
                                <div className="meta-row">
                                    <span className="meta-label">Von:</span>
                                    {/* GAME ELEMENT: Suspicious Sender */}
                                    <SuspiciousZone 
                                        id="spoofed-domain"
                                        tooltipTitle="GEFÄLSCHTE DOMAIN"
                                        tooltipText="Falsch geschriebenes 'PayPal' (Großes I statt kleinem l)"
                                    >
                                        account-security@paypaI-support.net
                                    </SuspiciousZone>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Betreff:</span>
                                    <span style={{fontWeight:'bold'}}>HANDLUNGSBEDARF: Unautorisierter Zugriff erkannt</span>
                                </div>
                            </div>
                            
                            <div className="email-body">
                                <p style={{marginBottom:'15px'}}>Sehr geehrter Kunde,</p>
                                
                                <p style={{marginBottom:'15px'}}>
                                    Wir haben verdächtige Aktivitäten auf Ihrem Firmenkonto festgestellt. Um eine dauerhafte Sperrung zu verhindern, müssen Sie{' '}
                                    <SuspiciousZone
                                        id="ai-syntax"
                                        tooltipTitle="KI-STIL"
                                        tooltipText='Unnatürliche Formulierung ("das Notwendige veranlassen")'
                                    >
                                        bitte das Notwendige veranlassen.
                                    </SuspiciousZone>
                                    Bitte machen Sie dies{' '}
                                    <SuspiciousZone
                                        id="urgency"
                                        tooltipTitle="DRINGLICHKEIT"
                                        tooltipText="Typisches Druckmittel: Kurze Frist soll Panik erzeugen."
                                    >
                                        innerhalb von 24 Stunden.
                                    </SuspiciousZone>
                                </p>

                                <p style={{marginBottom:'15px'}}>Bitte verifizieren Sie Ihre Identität über das sichere Portal unten:</p>

                                {/* Clue: Malicious Link */}
                                <SuspiciousZone
                                    id="malicious-link"
                                    tooltipTitle="SCHÄDLICHER LINK"
                                    tooltipText="Linkziel maskiert. Führt zu 'papyal-verify.com'"
                                    style={{background:'#3b82f6', color:'white', padding:'10px 20px', borderRadius:'4px', marginBottom:'20px', fontWeight:'bold', display: 'inline-block'}}
                                >
                                    <a href="http://paypaI-verify.com" onClick={(e) => e.preventDefault()}>Jetzt Identität Verifizieren</a>
                                </SuspiciousZone>

                                <p style={{color:'#64748b', fontSize:'0.8rem'}}>
                                    Security Team<br/>
                                    Global Operations<br/>
                                    {/* Clue: Logic Error */}
                                    <SuspiciousZone
                                        id="logic-error"
                                        tooltipTitle="LOGIKFEHLER"
                                        tooltipText="Veraltetes Copyright-Datum (Aktuelles Jahr ist 2025)"
                                    >
                                        Copyright 2022
                                    </SuspiciousZone>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right: Evidence & Verdict */}
                <aside className="panel panel-details">
                    <h3 style={{marginBottom:'20px'}}>Untersuchungsbericht</h3>

                    <div className="stat-card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                            <div className="stat-header" id="evidence-header" style={{marginBottom: 0}}>
                                Gesammelte Beweise ({foundClues.length}/{totalClues})
                            </div>
                            
                            {/* Hints Toggle */}
                            <div className="hints-toggle-wrapper">
                                <span className="hints-label">Hinweise</span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        id="hints-toggle" 
                                        checked={hintsEnabled} 
                                        onChange={(e) => setHintsEnabled(e.target.checked)} 
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Hints Disabled by default */}
                        <ul className={`evidence-list ${!hintsEnabled ? 'hints-disabled' : ''}`} id="evidence-list">
                            {evidenceList.map(item => (
                                <li 
                                    key={item.id} 
                                    className={`evidence-item ${foundClues.includes(item.id) ? 'checked' : ''}`} 
                                    data-target={item.id}
                                >
                                    <span className="evidence-check">✓</span>
                                    <span className="evidence-text">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">Kontext-Analyse</div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px'}}>
                            <span style={{fontSize:'0.9rem'}}>KI-Wahrscheinlichkeit</span>
                            <span id="artificiality-text" style={{fontWeight:'bold', color: scoreData.color}}>
                                {scoreData.percentage}%
                            </span>
                        </div>
                        <div style={{height:'6px', background:'#334155', borderRadius:'3px', marginTop:'8px', overflow:'hidden'}}>
                            <div 
                                id="artificiality-bar" 
                                style={{
                                    width: `${scoreData.percentage}%`, 
                                    height:'100%', 
                                    background: scoreData.color,
                                    transition: 'all 0.3s ease'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="verdict-section">
                        <div className="stat-header">Endgültiges Urteil</div>
                        <p style={{fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'10px'}}>
                            Wählen Sie die entsprechende Klassifizierung, um Fall #4092 abzuschließen.
                        </p>
                        <div className="btn-group">
                            <button 
                                className={`btn btn-safe ${verdict === 'safe' ? 'selected' : ''}`} 
                                id="btn-safe"
                                onClick={() => setVerdict('safe')}
                            >
                                LEGITIM
                            </button>
                            <button 
                                className={`btn btn-scam ${verdict === 'scam' ? 'selected' : ''}`} 
                                id="btn-scam"
                                onClick={() => setVerdict('scam')}
                            >
                                SCHÄDLICH
                            </button>
                        </div>
                        <button 
                            className="btn" 
                            id="submit-btn" 
                            style={{width:'100%', marginTop:'15px', background:'var(--accent-primary)', color:'white', boxShadow:'0 4px 10px rgba(59, 130, 246, 0.3)'}}
                            onClick={handleSubmit}
                        >
                            AN ZENTRALE SENDEN
                        </button>
                    </div>
                    
                    <div style={{marginTop:'40px', paddingTop:'20px', borderTop:'1px solid var(--panel-border)'}}>
                        <div className="stat-header">Abteilungs-Bestenliste</div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginTop:'10px'}}>
                            <span>1. Technik</span>
                            <span style={{color:'var(--accent-success)'}}>98% Sicher</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginTop:'8px', opacity:0.7}}>
                            <span>2. Vertrieb (Du)</span>
                            <span style={{color:'var(--accent-warning)'}}>84% Sicher</span>
                        </div>
                         <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginTop:'8px', opacity:0.5}}>
                            <span>3. HR</span>
                            <span>79% Sicher</span>
                        </div>
                    </div>

                </aside>
            </div>

            {/* RADIAL CONTEXT WHEEL MENU */}
            <div 
                id="context-wheel" 
                className={`context-wheel ${wheelState.active ? 'active' : ''} ${wheelState.shake ? 'shake' : ''}`}
                style={{ top: wheelState.y, left: wheelState.x }}
            >
                {wheelOptions.map((opt, index) => {
                     // Translate relative to center of wheel
                     const transformStyle = `translate(${opt.pos.x}px, ${opt.pos.y}px)`;
                     return (
                        <button 
                            key={opt.reason} 
                            className={`wheel-btn ${wheelState.wrongBtnIndex === index ? 'wrong' : ''}`} 
                            data-reason={opt.reason}
                            onClick={(e) => handleWheelOptionClick(e, opt.reason, index)}
                            style={{ transform: transformStyle }}
                        >
                            {opt.label}
                        </button>
                     );
                })}
                <div className="wheel-center" onClick={(e) => { e.stopPropagation(); closeWheel(); }}>✖</div>
            </div>

            {/* RESULT MODAL */}
            <div className={`modal-overlay ${modalState.active ? 'active' : ''}`} id="result-modal">
                <div className="modal-content">
                    <div className="modal-title" id="modal-title" style={{color: modalState.color}}>
                        {modalState.title}
                    </div>
                    <div 
                        className="modal-body" 
                        id="modal-body"
                        dangerouslySetInnerHTML={{__html: modalState.body}}
                    ></div>
                    <button className="modal-btn" onClick={() => window.location.reload()}>Nächster Fall</button>
                </div>
            </div>
        </div>
    );
};

export default DetectiveStory;