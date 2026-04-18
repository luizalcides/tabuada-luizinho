import { useState } from "react";
import { TABUADAS_DISPONIVEIS } from "../data/questions";
import type { GameState } from "../state/storage";

type Props = {
  state: GameState;
  onVoltar: () => void;
};

const PIN = "2468";

export function ParentDashboard({ state, onVoltar }: Props) {
  const [autenticado, setAutenticado] = useState(false);
  const [input, setInput] = useState("");
  const [erro, setErro] = useState(false);

  function verificar() {
    if (input === PIN) {
      setAutenticado(true);
      setErro(false);
    } else {
      setErro(true);
      setInput("");
    }
  }

  if (!autenticado) {
    return (
      <div className="screen parent-lock">
        <header className="album-header">
          <button className="icon-btn" onClick={onVoltar} aria-label="Voltar">
            ←
          </button>
          <h1>Modo pais</h1>
          <span />
        </header>
        <p className="lock-hint">Digite o PIN dos pais</p>
        <p className="lock-hint-small">(padrão: 2468 — altere no código se quiser)</p>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verificar()}
          className="pin-input"
          autoFocus
        />
        {erro && <p className="erro-pin">PIN incorreto</p>}
        <button className="btn-primary" onClick={verificar}>
          Entrar
        </button>
      </div>
    );
  }

  const totalSessoes = Object.values(state.stats).reduce((s, x) => s + x.sessoes, 0);
  const totalAcertos = Object.values(state.stats).reduce((s, x) => s + x.acertos, 0);
  const totalErros = Object.values(state.stats).reduce((s, x) => s + x.erros, 0);
  const totalPerguntas = totalAcertos + totalErros;
  const percentualGeral =
    totalPerguntas > 0 ? Math.round((totalAcertos / totalPerguntas) * 100) : 0;

  return (
    <div className="screen parent-dashboard">
      <header className="album-header">
        <button className="icon-btn" onClick={onVoltar} aria-label="Voltar">
          ←
        </button>
        <h1>Progresso</h1>
        <span />
      </header>

      <section className="resumo">
        <div className="resumo-card">
          <span className="resumo-label">Sessões</span>
          <span className="resumo-valor">{totalSessoes}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Acertos</span>
          <span className="resumo-valor">{totalAcertos}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Aproveitamento</span>
          <span className="resumo-valor">{percentualGeral}%</span>
        </div>
      </section>

      <section>
        <h2>Desempenho por tabuada</h2>
        <div className="tabela-stats">
          {TABUADAS_DISPONIVEIS.map((t) => {
            const s = state.stats[t];
            const total = s.acertos + s.erros;
            const pct = total > 0 ? Math.round((s.acertos / total) * 100) : 0;
            return (
              <div key={t} className="linha-stat">
                <span className="linha-tab">Tabuada {t}</span>
                <div className="linha-bar">
                  <div
                    className="linha-fill"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 80 ? "#3fa34d" : pct >= 50 ? "#d4a017" : "#c7513f",
                    }}
                  />
                </div>
                <span className="linha-pct">
                  {s.sessoes === 0 ? "—" : `${pct}% (${s.acertos}/${total})`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {state.historico.length > 0 && (
        <section>
          <h2>Últimas sessões</h2>
          <ul className="historico">
            {state.historico.slice(0, 10).map((h, i) => (
              <li key={i} className="historico-item">
                <span>
                  Tab. {h.tabuada} — {h.acertos}/{h.total}
                </span>
                <span className="historico-data">
                  {new Date(h.data).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="dica-pais">
        Dica: sessões curtas e frequentes funcionam melhor que uma longa. Se ele
        errar, a tela mostra os grupos — conte junto com ele para reforçar.
      </p>
    </div>
  );
}
