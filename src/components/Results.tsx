import { useMemo, useState } from "react";
import {
  CREATURES,
  getCreatureById,
  RARIDADE_COR,
  RARIDADE_LABEL,
  RARIDADE_ORDEM,
  type Creature,
  type Rarity,
} from "../data/creatures";
import type { Tabuada } from "../data/questions";
import type { GameState } from "../state/storage";

type Props = {
  tabuada: Tabuada;
  acertos: number;
  total: number;
  cartasGanhas: string[];
  state: GameState;
  somLigado: boolean;
  onVoltar: () => void;
  onPraticarDeNovo: () => void;
};

const DICAS_RARIDADE: Record<Rarity, string> = {
  comum: "Continue acertando 3 em sequência para ganhar mais cartas comuns.",
  rara: "Acerte 10 de 10 numa tabuada para ter uma boa chance de ganhar uma rara!",
  epica: "Acerte 10 de 10 numa tabuada difícil (6, 7, 8 ou 9) para garantir uma épica.",
  lendaria: "A mais rara! Sai só com 10 de 10 numa tabuada difícil — e um toque de sorte.",
};

function tocarRevelacao(rarity: Rarity) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sequencias: Record<Rarity, number[]> = {
      comum: [660],
      rara: [660, 880],
      epica: [660, 880, 1046],
      lendaria: [523, 659, 784, 988, 1175],
    };
    const notas = sequencias[rarity];
    const espaco = rarity === "lendaria" ? 0.12 : 0.09;
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = ctx.currentTime + i * espaco;
      const dur = rarity === "lendaria" ? 0.28 : 0.22;
      osc.type = rarity === "lendaria" || rarity === "epica" ? "triangle" : "sine";
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.frequency.value = freq;
      osc.start(start);
      osc.stop(start + dur);
    });
  } catch {
    // audio unavailable
  }
}

function escolherTeaser(state: GameState): Creature | null {
  const nao = CREATURES.filter((c) => !state.cartas[c.id]);
  if (nao.length === 0) return null;
  for (const r of [...RARIDADE_ORDEM].reverse()) {
    const pool = nao.filter((c) => c.raridade === r);
    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return null;
}

export function Results({
  tabuada,
  acertos,
  total,
  cartasGanhas,
  state,
  somLigado,
  onVoltar,
  onPraticarDeNovo,
}: Props) {
  const [reveladas, setReveladas] = useState<boolean[]>(
    cartasGanhas.map(() => false)
  );

  const teaser = useMemo(() => escolherTeaser(state), [state]);

  const mensagem =
    acertos === total
      ? "Perfeito! Você é craque!"
      : acertos >= total - 2
        ? "Muito bom!"
        : acertos >= total / 2
          ? "Bom trabalho!"
          : "Continue tentando, você está aprendendo!";

  function revelar(i: number) {
    const creature = getCreatureById(cartasGanhas[i]);
    if (!creature) return;
    if (reveladas[i]) return;
    if (somLigado) tocarRevelacao(creature.raridade);
    setReveladas((r) => r.map((v, idx) => (idx === i ? true : v)));
  }

  return (
    <div className="screen results">
      <h1>Acabou! 🎉</h1>
      <div className="score-big">
        <span className="score-num">{acertos}</span>
        <span className="score-divider">/</span>
        <span className="score-total">{total}</span>
      </div>
      <p className="score-msg">{mensagem}</p>
      <p className="score-sub">Tabuada do {tabuada}</p>

      {cartasGanhas.length > 0 && (
        <section className="cartas-ganhas">
          <h2>Você ganhou {cartasGanhas.length === 1 ? "uma carta!" : `${cartasGanhas.length} cartas!`}</h2>
          <p className="cartas-dica">Toque em cada carta para revelar ✨</p>
          <div className="cartas-reveal-grid">
            {cartasGanhas.map((id, i) => {
              const creature = getCreatureById(id);
              if (!creature) return null;
              const aberto = reveladas[i];
              const classes = [
                "carta-reveal",
                aberto ? `aberto raridade-${creature.raridade}` : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={`${id}-${i}`}
                  className={classes}
                  style={{ borderColor: aberto ? RARIDADE_COR[creature.raridade] : undefined }}
                  onClick={() => revelar(i)}
                  aria-label={aberto ? creature.nome : "Carta misteriosa, toque para revelar"}
                >
                  {aberto ? (
                    <>
                      <div className="carta-brilho" aria-hidden />
                      <div className="carta-raios" aria-hidden />
                      <span className="carta-emoji">{creature.emoji}</span>
                      <span className="carta-nome">{creature.nome}</span>
                      <span
                        className="carta-raridade"
                        style={{ color: RARIDADE_COR[creature.raridade] }}
                      >
                        {RARIDADE_LABEL[creature.raridade]}
                      </span>
                    </>
                  ) : (
                    <span className="carta-back">?</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {cartasGanhas.length === 0 && (
        <p className="sem-cartas">
          Sem cartas novas desta vez, mas continua tentando que elas aparecem!
        </p>
      )}

      {teaser && (
        <section className="teaser">
          <h2>Essa aqui ainda falta</h2>
          <div
            className="teaser-card"
            style={{ borderColor: RARIDADE_COR[teaser.raridade] }}
          >
            <span className="teaser-silhueta" aria-hidden>
              {teaser.emoji}
            </span>
            <span
              className="teaser-raridade"
              style={{ color: RARIDADE_COR[teaser.raridade] }}
            >
              {RARIDADE_LABEL[teaser.raridade]}
            </span>
            <p className="teaser-dica">{DICAS_RARIDADE[teaser.raridade]}</p>
          </div>
        </section>
      )}

      <div className="results-actions">
        <button className="btn-primary" onClick={onPraticarDeNovo}>
          Praticar de novo
        </button>
        <button className="btn-ghost" onClick={onVoltar}>
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
