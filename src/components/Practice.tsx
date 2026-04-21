import { useEffect, useMemo, useRef, useState } from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  generateSession,
  type Modo,
  type Question,
  type Tabuada,
} from "../data/questions";

export type PracticeResult = {
  tabuada: Tabuada;
  modo: Modo;
  acertos: number;
  total: number;
  duracaoSegundos: number;
  cartasPorStreak: number;
};

type Props = {
  tabuada: Tabuada;
  modo: Modo;
  onFinish: (result: PracticeResult) => void;
  onExit: () => void;
  somLigado: boolean;
};

type Phase = "perguntando" | "acertou" | "errou-primeira" | "errou-segunda";

const STREAK_ALVO = 3;

export function Practice({ tabuada, modo, onFinish, onExit, somLigado }: Props) {
  const questions = useMemo<Question[]>(
    () => generateSession(tabuada, modo, 10),
    [tabuada, modo]
  );
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("perguntando");
  const [tentativas, setTentativas] = useState(0);
  const [streak, setStreak] = useState(0);
  const [cartaAcabouDeCair, setCartaAcabouDeCair] = useState(false);
  const inicioRef = useRef<number>(Date.now());
  const acertosRef = useRef(0);
  const indexRef = useRef(0);
  const streakRef = useRef(0);
  const cartasPorStreakRef = useRef(0);

  const atual = questions[index];
  const total = questions.length;

  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  function tocarSom(tipo: "ok" | "erro" | "carta") {
    if (!somLigado) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (tipo === "carta") {
        const notas = [660, 880, 1174];
        notas.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          const start = ctx.currentTime + i * 0.09;
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.08, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
          osc.frequency.value = freq;
          osc.start(start);
          osc.stop(start + 0.22);
        });
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.frequency.value = tipo === "ok" ? 660 : 330;
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // audio unavailable
    }
  }

  function handleDigit(d: string) {
    if (phase !== "perguntando") return;
    if (input.length >= 3) return;
    setInput(input + d);
  }

  function handleClear() {
    if (phase !== "perguntando") return;
    setInput("");
  }

  function handleBackspace() {
    if (phase !== "perguntando") return;
    setInput(input.slice(0, -1));
  }

  function registrarAcerto() {
    acertosRef.current += 1;
    const novoStreak = streakRef.current + 1;
    if (novoStreak >= STREAK_ALVO) {
      streakRef.current = 0;
      cartasPorStreakRef.current += 1;
      setStreak(0);
      setCartaAcabouDeCair(true);
      tocarSom("carta");
      setTimeout(() => setCartaAcabouDeCair(false), 1400);
    } else {
      streakRef.current = novoStreak;
      setStreak(novoStreak);
    }
  }

  function handleSubmit() {
    if (phase !== "perguntando" || input === "") return;
    const resposta = parseInt(input, 10);
    if (resposta === atual.answer) {
      if (tentativas === 0) {
        registrarAcerto();
      } else {
        streakRef.current = 0;
        setStreak(0);
      }
      tocarSom("ok");
      setPhase("acertou");
      setTimeout(proximaPergunta, 900);
    } else {
      tocarSom("erro");
      if (tentativas === 0) {
        setPhase("errou-primeira");
        setTentativas(1);
      } else {
        streakRef.current = 0;
        setStreak(0);
        setPhase("errou-segunda");
        setTimeout(proximaPergunta, 2500);
      }
    }
  }

  function tentarNovamente() {
    setInput("");
    setPhase("perguntando");
  }

  function proximaPergunta() {
    setInput("");
    setTentativas(0);
    setPhase("perguntando");
    if (indexRef.current + 1 >= total) {
      const duracaoSegundos = Math.round((Date.now() - inicioRef.current) / 1000);
      onFinish({
        tabuada,
        modo,
        acertos: acertosRef.current,
        total,
        duracaoSegundos,
        cartasPorStreak: cartasPorStreakRef.current,
      });
    } else {
      indexRef.current += 1;
      setIndex(indexRef.current);
    }
  }

  const progresso = ((index + (phase !== "perguntando" ? 1 : 0)) / total) * 100;
  const streakRestante = Math.max(0, STREAK_ALVO - streak);
  const cartaProgresso = (streak / STREAK_ALVO) * 100;

  return (
    <div className="screen practice">
      <header className="practice-header">
        <button className="icon-btn" onClick={onExit} aria-label="Sair">
          ✕
        </button>
        <div className="practice-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>
          <span className="progress-text">
            {index + 1} de {total}
          </span>
        </div>
      </header>

      <div className={`carta-meter${cartaAcabouDeCair ? " brilhando" : ""}`}>
        <div className="carta-meter-bar">
          <div
            className="carta-meter-fill"
            style={{ width: `${cartaProgresso}%` }}
          />
          <div className="carta-meter-pontos">
            {Array.from({ length: STREAK_ALVO }).map((_, i) => (
              <span
                key={i}
                className={`carta-meter-ponto${i < streak ? " aceso" : ""}`}
              />
            ))}
          </div>
        </div>
        <span className="carta-meter-texto">
          {cartaAcabouDeCair
            ? "Carta garantida! 🎴"
            : streakRestante === STREAK_ALVO
              ? `Acerte ${STREAK_ALVO} seguidos para ganhar uma carta`
              : streakRestante === 1
                ? "Falta 1 acerto para uma carta!"
                : `Faltam ${streakRestante} acertos para uma carta`}
        </span>
      </div>

      <main className="practice-main">
        {phase === "errou-primeira" || phase === "errou-segunda" ? (
          <VisualizacaoErro atual={atual} />
        ) : (
          <div className="pergunta">
            <span className="pergunta-texto">
              {atual.a} × {atual.b} =
            </span>
            <span className={`resposta${phase === "acertou" ? " ok" : ""}`}>
              {phase === "acertou" ? atual.answer : input || "?"}
            </span>
          </div>
        )}

        {phase === "acertou" && <div className="feedback ok">Boa! ✨</div>}
        {phase === "errou-primeira" && (
          <div className="feedback gentle">
            <p>
              Quase! Olha: <strong>{atual.a} × {atual.b}</strong> é {atual.a} grupos de {atual.b}.
            </p>
            <p>Conte os bichinhos e tente de novo.</p>
            <button className="btn-primary small" onClick={tentarNovamente}>
              Tentar de novo
            </button>
          </div>
        )}
        {phase === "errou-segunda" && (
          <div className="feedback gentle">
            <p>
              Tudo bem! A resposta é <strong>{atual.answer}</strong>.
            </p>
            <p>Vamos para a próxima!</p>
          </div>
        )}
      </main>

      {phase === "perguntando" && (
        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} className="key" onClick={() => handleDigit(String(n))}>
              {n}
            </button>
          ))}
          <button className="key key-aux" onClick={handleClear}>
            C
          </button>
          <button className="key" onClick={() => handleDigit("0")}>
            0
          </button>
          <button className="key key-aux" onClick={handleBackspace} aria-label="Apagar">
            ⌫
          </button>
          <button
            className="key key-ok"
            onClick={handleSubmit}
            disabled={input === ""}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

function VisualizacaoErro({ atual }: { atual: Question }) {
  const icones = ["🐟", "🐠", "🐦", "🦐", "🐚", "🦀", "🐙", "🐢"];
  const icone = icones[(atual.a + atual.b) % icones.length];
  const grupos: number[] = Array.from({ length: atual.a }, (_, i) => i);
  return (
    <div className="visual-erro">
      <p className="visual-titulo">
        {atual.a} grupos de {atual.b}:
      </p>
      <div className="grupos">
        {grupos.map((g) => (
          <div key={g} className="grupo">
            {Array.from({ length: atual.b }).map((_, j) => (
              <span key={j} className="grupo-item">
                {icone}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
