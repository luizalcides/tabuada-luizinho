import { useState } from "react";
import { TABUADAS_DISPONIVEIS } from "../data/questions";
import {
  BackupError,
  exportState,
  importState,
  resetState,
  saveState,
  summarizeState,
  type GameState,
} from "../state/storage";

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

      <BackupSection state={state} />
      <ResetSection />
    </div>
  );
}

function BackupSection({ state }: { state: GameState }) {
  const [codigoExportado, setCodigoExportado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [inputCodigo, setInputCodigo] = useState("");
  const [preview, setPreview] = useState<{ cartas: number; sessoes: number } | null>(
    null
  );
  const [previewState, setPreviewState] = useState<GameState | null>(null);
  const [erroImport, setErroImport] = useState<string | null>(null);

  async function handleExport() {
    const code = exportState(state);
    setCodigoExportado(code);
    setCopiado(false);
    try {
      await navigator.clipboard.writeText(code);
      setCopiado(true);
    } catch {
      // clipboard API indisponível — o usuário copia do textarea manualmente
    }
  }

  function handleValidar() {
    setErroImport(null);
    setPreview(null);
    setPreviewState(null);
    try {
      const novo = importState(inputCodigo);
      setPreviewState(novo);
      setPreview(summarizeState(novo));
    } catch (err) {
      if (err instanceof BackupError) {
        setErroImport(err.message);
      } else {
        setErroImport("Não foi possível ler o código.");
      }
    }
  }

  function handleConfirmarRestauracao() {
    if (!previewState) return;
    saveState(previewState);
    window.location.reload();
  }

  return (
    <section className="backup-section">
      <h2>Backup da coleção</h2>
      <p className="backup-desc">
        Salve um código de backup em Notas ou WhatsApp. Se o progresso sumir
        (trocar de celular, limpar dados), você recupera tudo colando o código.
      </p>

      <div className="backup-block">
        <h3 className="backup-sub">Exportar</h3>
        <button className="btn-primary small" onClick={handleExport}>
          Gerar código de backup
        </button>
        {codigoExportado && (
          <>
            <textarea
              className="backup-codigo"
              value={codigoExportado}
              readOnly
              rows={4}
              onFocus={(e) => e.target.select()}
            />
            <p className="backup-status">
              {copiado
                ? "✓ Copiado para a área de transferência. Cole em Notas ou WhatsApp."
                : "Selecione o texto acima e copie manualmente."}
            </p>
          </>
        )}
      </div>

      <div className="backup-block">
        <h3 className="backup-sub">Restaurar</h3>
        <textarea
          className="backup-codigo"
          value={inputCodigo}
          onChange={(e) => {
            setInputCodigo(e.target.value);
            setPreview(null);
            setPreviewState(null);
            setErroImport(null);
          }}
          placeholder="Cole aqui o código de backup"
          rows={4}
        />
        <button
          className="btn-ghost small"
          onClick={handleValidar}
          disabled={inputCodigo.trim() === ""}
        >
          Validar código
        </button>
        {erroImport && <p className="erro-pin">{erroImport}</p>}
        {preview && previewState && (
          <div className="backup-preview">
            <p>
              Esse backup tem <strong>{preview.cartas} cartas</strong> e{" "}
              <strong>{preview.sessoes} sessões</strong>.
            </p>
            <p className="backup-aviso">
              Restaurar vai <strong>substituir</strong> o progresso atual. Confirma?
            </p>
            <button className="btn-primary small" onClick={handleConfirmarRestauracao}>
              Sim, restaurar
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ResetSection() {
  const [etapa, setEtapa] = useState<"inicial" | "confirmando">("inicial");

  function handleZerar() {
    resetState();
    window.location.reload();
  }

  return (
    <section className="reset-section">
      <h2>Zona de risco</h2>
      {etapa === "inicial" ? (
        <button
          className="btn-danger"
          onClick={() => setEtapa("confirmando")}
        >
          Zerar progresso
        </button>
      ) : (
        <div className="reset-confirm">
          <p>
            Tem certeza? Isso apaga <strong>todas as cartas, estatísticas e
            histórico</strong>. Não tem como desfazer.
          </p>
          <p className="backup-aviso">
            Dica: gere um código de backup antes, caso queira recuperar depois.
          </p>
          <div className="reset-actions">
            <button className="btn-ghost small" onClick={() => setEtapa("inicial")}>
              Cancelar
            </button>
            <button className="btn-danger small" onClick={handleZerar}>
              Sim, apagar tudo
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
