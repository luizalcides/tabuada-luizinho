import { TABUADAS_DISPONIVEIS, type Tabuada } from "../data/questions";
import { TOTAL_CARTAS } from "../data/creatures";
import type { GameState } from "../state/storage";
import { totalCartasColetadas } from "../state/storage";

type Props = {
  state: GameState;
  onStart: (t: Tabuada) => void;
  onOpenAlbum: () => void;
  onOpenPais: () => void;
  onToggleSom: () => void;
};

export function Home({ state, onStart, onOpenAlbum, onOpenPais, onToggleSom }: Props) {
  const coletadas = totalCartasColetadas(state);
  const progresso = Math.round((coletadas / TOTAL_CARTAS) * 100);

  return (
    <div className="screen home">
      <header className="home-header">
        <div className="home-title">
          <h1>Tabuada do Luizinho</h1>
          <span className="home-version">
            v {__APP_BUILD_DATE__} · {__APP_COMMIT__}
          </span>
        </div>
        <button
          className="icon-btn"
          onClick={onToggleSom}
          aria-label={state.somLigado ? "Desligar som" : "Ligar som"}
          title={state.somLigado ? "Som ligado" : "Som desligado"}
        >
          {state.somLigado ? "🔊" : "🔇"}
        </button>
      </header>

      <section className="colecao-card">
        <div className="colecao-info">
          <span className="colecao-titulo">Minha Coleção</span>
          <span className="colecao-contador">
            {coletadas} de {TOTAL_CARTAS} cartas
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progresso}%` }} />
        </div>
        <button className="btn-ghost" onClick={onOpenAlbum}>
          Abrir álbum 📖
        </button>
      </section>

      <section>
        <h2>Escolha a tabuada</h2>
        <div className="tabuada-grid">
          {TABUADAS_DISPONIVEIS.map((t) => {
            const stats = state.stats[t];
            const dominada = stats && stats.melhorPontuacao >= 9;
            return (
              <button
                key={t}
                className={`tabuada-btn${dominada ? " dominada" : ""}`}
                onClick={() => onStart(t)}
              >
                <span className="tabuada-numero">{t}</span>
                <span className="tabuada-label">
                  {dominada ? "⭐ dominei!" : "praticar"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="home-footer">
        <button className="btn-ghost small" onClick={onOpenPais}>
          Modo pais
        </button>
      </footer>
    </div>
  );
}
