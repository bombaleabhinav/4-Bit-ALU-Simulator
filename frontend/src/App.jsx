import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

import Switch from './components/Switch';
import Led from './components/Led';
import ALUDiagram from './components/ALUDiagram';
import ControlPanel from './components/ControlPanel';
import OutputPanel from './components/OutputPanel';

const API_URL = 'http://localhost:8000/alu';

function App() {
  // ─── Input State ───
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [S, setS] = useState(0);
  const [mode, setMode] = useState(1); // 1=logic, 0=arithmetic
  const [cin, setCin] = useState(0);

  // ─── Output State ───
  const [Y, setY] = useState(0);
  const [carry, setCarry] = useState(0);
  const [operation, setOperation] = useState('');

  const controllerRef = useRef(null);

  const compute = useCallback(async (a, b, s, m, c) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ A: a, B: b, S: s, mode: m, cin: c }),
        signal: controller.signal,
      });
      const data = await res.json();
      setY(data.Y);
      setCarry(data.carry);
      setOperation(data.operation);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('ALU fetch error:', err);
    }
  }, []);

  useEffect(() => {
    compute(A, B, S, mode, cin);
  }, [A, B, S, mode, cin, compute]);

  // ─── Bit helpers ───
  const aBits = [(A >> 3) & 1, (A >> 2) & 1, (A >> 1) & 1, A & 1];
  const bBits = [(B >> 3) & 1, (B >> 2) & 1, (B >> 1) & 1, B & 1];

  const handleABit = (i, v) => {
    const b = [...aBits]; b[i] = v;
    setA((b[0] << 3) | (b[1] << 2) | (b[2] << 1) | b[3]);
  };
  const handleBBit = (i, v) => {
    const b = [...bBits]; b[i] = v;
    setB((b[0] << 3) | (b[1] << 2) | (b[2] << 1) | b[3]);
  };

  const isLogic = mode === 1;

  return (
    <div className="app">
      {/* ═══ TOP BAR: Title + Mode Toggle ═══ */}
      <header className="top-bar">
        <h1 className="app-title">4-BIT ALU SIMULATOR</h1>
        <div className="mode-toggle-area">
          <span className="mode-toggle-label">MODE (M)</span>
          <div className="mode-toggle" onClick={() => setMode(isLogic ? 0 : 1)}>
            <div className={`mode-option ${!isLogic ? 'active' : ''}`}>ARITHMETIC</div>
            <div className={`mode-option ${isLogic ? 'active' : ''}`}>LOGIC</div>
          </div>
          <div className="cin-area">
            <Switch label="Cin" value={cin} onChange={setCin} />
          </div>
        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="main-area">

        {/* ── LEFT: Input switches ── */}
        <div className="input-column">
          {/* Input A */}
          <div className="input-block">
            <div className="input-switches">
              {['A3', 'A2', 'A1', 'A0'].map((label, i) => (
                <div className="input-row" key={label}>
                  <Switch label={label} value={aBits[i]} onChange={(v) => handleABit(i, v)} />
                  <div className="wire-line" />
                </div>
              ))}
            </div>
            <div className="input-decimal">A = {A}</div>
          </div>

          {/* Input B */}
          <div className="input-block">
            <div className="input-switches">
              {['B3', 'B2', 'B1', 'B0'].map((label, i) => (
                <div className="input-row" key={label}>
                  <Switch label={label} value={bBits[i]} onChange={(v) => handleBBit(i, v)} />
                  <div className="wire-line" />
                </div>
              ))}
            </div>
            <div className="input-decimal">B = {B}</div>
          </div>
        </div>

        {/* ── CENTER: ALU Diagram ── */}
        <div className="center-column">
          <ALUDiagram mode={mode} operation={operation} />
        </div>

        {/* ── RIGHT: Output LEDs ── */}
        <div className="output-column">
          <div className="output-wire-line" />
          <OutputPanel Y={Y} carry={carry} />
        </div>
      </div>

      {/* ═══ BOTTOM: S Selection Switches ═══ */}
      <div className="bottom-bar">
        <ControlPanel S={S} onSChange={setS} />
      </div>
    </div>
  );
}

export default App;
