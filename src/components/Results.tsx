import { useState } from "react";
import { getCreatureById, RARIDADE_COR, RARIDADE_LABEL } from "../data/creatures";
import type { Tabuada } from "../data/questions";

type Props = {
  tabuada: Tabuada;
  acertos: number;
  total: number;
  cartasGanhas: string[];
  onVoltar: () => void;
  onPraticarDeNovo: () => void;
};

export function Results({
  tabuada,
  acertos,
  total,
  cartasGanhas,
  onVoltar,
  onPraticarDeNovo,
}: Props) {
  const [reveladas, setReveladas] = useState<boolean[]>(
    cartasGanhas.map(() => false)
  );

  const mensagem =
    acertos === total
      ? "Perfeito! Você é craque!"
      : acertos >= total - 2
        ? "Muito bom!"
        : acertos >= total / 2
          ? "Bom trabalho!"
          : "Continue tentando, você está aprendendo!";

  function revelar(i: number) {
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
          <div className="cartas-reveal-grid">
            {cartasGanhas.map((id, i) => {
              const creature = getCreatureById(id);
              if (!creature) return null;
              const aberto = reveladas[i];
              return (
                <button
                  key={`${id}-${i}`}
                  className={`carta-reveal${aberto ? " aberto" : ""}`}
                  style={{ borderColor: aberto ? RARIDADE_COR[creature.raridade] : undefined }}
                  onClick={() => revelar(i)}
                  aria-label={aberto ? creature.nome : "Carta misteriosa, toque para revelar"}
                >
                  {aberto ? (
                    <>
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
