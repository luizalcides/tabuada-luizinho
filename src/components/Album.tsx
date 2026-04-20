import { useState } from "react";
import {
  CREATURES,
  RARIDADE_COR,
  RARIDADE_LABEL,
  RARIDADE_ORDEM,
  TOTAL_CARTAS,
  getArteUrl,
  type Creature,
} from "../data/creatures";
import type { GameState } from "../state/storage";

type Props = {
  state: GameState;
  onVoltar: () => void;
};

export function Album({ state, onVoltar }: Props) {
  const [selecionada, setSelecionada] = useState<Creature | null>(null);
  const coletadas = Object.keys(state.cartas).filter(
    (id) => (state.cartas[id] ?? 0) > 0
  ).length;

  return (
    <div className="screen album">
      <header className="album-header">
        <button className="icon-btn" onClick={onVoltar} aria-label="Voltar">
          ←
        </button>
        <h1>Álbum</h1>
        <span className="album-count">
          {coletadas}/{TOTAL_CARTAS}
        </span>
      </header>

      {RARIDADE_ORDEM.map((raridade) => {
        const doGrupo = CREATURES.filter((c) => c.raridade === raridade);
        return (
          <section key={raridade} className="album-secao">
            <h2 style={{ color: RARIDADE_COR[raridade] }}>
              {RARIDADE_LABEL[raridade]} · {doGrupo.filter((c) => state.cartas[c.id]).length}/{doGrupo.length}
            </h2>
            <div className="album-grid">
              {doGrupo.map((c) => {
                const qtd = state.cartas[c.id] ?? 0;
                const tem = qtd > 0;
                return (
                  <button
                    key={c.id}
                    className={`album-card${tem ? " possuida" : " bloqueada"}`}
                    style={tem ? { borderColor: RARIDADE_COR[raridade] } : undefined}
                    onClick={() => tem && setSelecionada(c)}
                    aria-label={tem ? c.nome : "Carta não coletada"}
                    disabled={!tem}
                  >
                    {tem ? (
                      <img
                        className="album-arte"
                        src={getArteUrl(c.id)}
                        alt={c.nome}
                        loading="lazy"
                      />
                    ) : (
                      <span className="album-emoji">❓</span>
                    )}
                    <span className="album-nome">{tem ? c.nome : "???"}</span>
                    {qtd > 1 && <span className="album-qtd">x{qtd}</span>}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {selecionada && (
        <div className="modal-backdrop" onClick={() => setSelecionada(null)}>
          <div
            className="modal"
            style={{ borderColor: RARIDADE_COR[selecionada.raridade] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="modal-arte"
              src={getArteUrl(selecionada.id)}
              alt={selecionada.nome}
            />
            <h3>{selecionada.nome}</h3>
            <span
              className="modal-raridade"
              style={{ color: RARIDADE_COR[selecionada.raridade] }}
            >
              {RARIDADE_LABEL[selecionada.raridade]}
            </span>
            <p className="modal-curiosidade">{selecionada.curiosidade}</p>
            <button className="btn-primary small" onClick={() => setSelecionada(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
