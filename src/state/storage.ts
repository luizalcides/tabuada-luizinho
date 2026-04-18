import { CREATURES, type Rarity } from "../data/creatures";
import type { Tabuada } from "../data/questions";

const STORAGE_KEY = "tabuada-luizinho-v1";

export type TabuadaStats = {
  acertos: number;
  erros: number;
  sessoes: number;
  ultimaSessao: number | null;
  melhorPontuacao: number;
};

export type SessionRecord = {
  tabuada: Tabuada;
  acertos: number;
  total: number;
  data: number;
  duracaoSegundos: number;
};

export type GameState = {
  cartas: Record<string, number>;
  stats: Record<number, TabuadaStats>;
  historico: SessionRecord[];
  somLigado: boolean;
};

const EMPTY_STATS: TabuadaStats = {
  acertos: 0,
  erros: 0,
  sessoes: 0,
  ultimaSessao: null,
  melhorPontuacao: 0,
};

function defaultState(): GameState {
  const stats: Record<number, TabuadaStats> = {};
  for (let t = 2; t <= 9; t++) stats[t] = { ...EMPTY_STATS };
  return {
    cartas: {},
    stats,
    historico: [],
    somLigado: false,
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as GameState;
    const base = defaultState();
    return {
      cartas: { ...base.cartas, ...parsed.cartas },
      stats: { ...base.stats, ...parsed.stats },
      historico: parsed.historico ?? [],
      somLigado: parsed.somLigado ?? false,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — silently continue
  }
}

export function addCarta(state: GameState, creatureId: string): GameState {
  const atual = state.cartas[creatureId] ?? 0;
  return {
    ...state,
    cartas: { ...state.cartas, [creatureId]: atual + 1 },
  };
}

export function totalCartasColetadas(state: GameState): number {
  return Object.keys(state.cartas).filter((id) => (state.cartas[id] ?? 0) > 0).length;
}

export function rollCarta(rarity: Rarity, state: GameState): string | null {
  const pool = CREATURES.filter((c) => c.raridade === rarity);
  if (pool.length === 0) return null;
  const naoColetadas = pool.filter((c) => !state.cartas[c.id]);
  const candidatos = naoColetadas.length > 0 ? naoColetadas : pool;
  const escolhida = candidatos[Math.floor(Math.random() * candidatos.length)];
  return escolhida.id;
}

export function registerSession(
  state: GameState,
  record: SessionRecord
): GameState {
  const stats = state.stats[record.tabuada] ?? { ...EMPTY_STATS };
  const erros = record.total - record.acertos;
  const novoStats: TabuadaStats = {
    acertos: stats.acertos + record.acertos,
    erros: stats.erros + erros,
    sessoes: stats.sessoes + 1,
    ultimaSessao: record.data,
    melhorPontuacao: Math.max(stats.melhorPontuacao, record.acertos),
  };
  return {
    ...state,
    stats: { ...state.stats, [record.tabuada]: novoStats },
    historico: [record, ...state.historico].slice(0, 50),
  };
}
