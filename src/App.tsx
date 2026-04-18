import { useEffect, useState } from "react";
import { Home } from "./components/Home";
import { Practice, type PracticeResult } from "./components/Practice";
import { Results } from "./components/Results";
import { Album } from "./components/Album";
import { ParentDashboard } from "./components/ParentDashboard";
import { isTabuadaDificil, type Tabuada } from "./data/questions";
import {
  addCarta,
  loadState,
  registerSession,
  rollCarta,
  saveState,
  type GameState,
} from "./state/storage";

type Screen =
  | { tipo: "home" }
  | { tipo: "practice"; tabuada: Tabuada }
  | {
      tipo: "results";
      tabuada: Tabuada;
      acertos: number;
      total: number;
      cartasGanhas: string[];
    }
  | { tipo: "album" }
  | { tipo: "pais" };

export function App() {
  const [state, setState] = useState<GameState>(() => loadState());
  const [screen, setScreen] = useState<Screen>({ tipo: "home" });

  useEffect(() => {
    saveState(state);
  }, [state]);

  function handleStart(tabuada: Tabuada) {
    setScreen({ tipo: "practice", tabuada });
  }

  function handleFinishPractice(result: PracticeResult) {
    const { tabuada, acertos, total } = result;
    const cartasIds = rollarCartas(tabuada, acertos, total, state);

    let novoEstado = registerSession(state, {
      tabuada,
      acertos,
      total,
      data: Date.now(),
      duracaoSegundos: result.duracaoSegundos,
    });
    for (const id of cartasIds) {
      novoEstado = addCarta(novoEstado, id);
    }
    setState(novoEstado);
    setScreen({
      tipo: "results",
      tabuada,
      acertos,
      total,
      cartasGanhas: cartasIds,
    });
  }

  function handleToggleSom() {
    setState((s) => ({ ...s, somLigado: !s.somLigado }));
  }

  if (screen.tipo === "home") {
    return (
      <Home
        state={state}
        onStart={handleStart}
        onOpenAlbum={() => setScreen({ tipo: "album" })}
        onOpenPais={() => setScreen({ tipo: "pais" })}
        onToggleSom={handleToggleSom}
      />
    );
  }

  if (screen.tipo === "practice") {
    return (
      <Practice
        tabuada={screen.tabuada}
        somLigado={state.somLigado}
        onFinish={handleFinishPractice}
        onExit={() => setScreen({ tipo: "home" })}
      />
    );
  }

  if (screen.tipo === "results") {
    return (
      <Results
        tabuada={screen.tabuada}
        acertos={screen.acertos}
        total={screen.total}
        cartasGanhas={screen.cartasGanhas}
        onVoltar={() => setScreen({ tipo: "home" })}
        onPraticarDeNovo={() => setScreen({ tipo: "practice", tabuada: screen.tabuada })}
      />
    );
  }

  if (screen.tipo === "album") {
    return <Album state={state} onVoltar={() => setScreen({ tipo: "home" })} />;
  }

  return <ParentDashboard state={state} onVoltar={() => setScreen({ tipo: "home" })} />;
}

function rollarCartas(
  tabuada: Tabuada,
  acertos: number,
  total: number,
  state: GameState
): string[] {
  const cartas: string[] = [];
  const dificil = isTabuadaDificil(tabuada);
  const perfeito = acertos === total;

  if (perfeito && dificil) {
    const epica = rollCarta("epica", state);
    if (epica) cartas.push(epica);
    if (Math.random() < 0.2) {
      const lendaria = rollCarta("lendaria", state);
      if (lendaria) cartas.push(lendaria);
    } else {
      const comum = rollCarta("comum", state);
      if (comum) cartas.push(comum);
    }
    return cartas;
  }

  if (perfeito) {
    const rara = rollCarta("rara", state);
    if (rara) cartas.push(rara);
    if (Math.random() < 0.25) {
      const epica = rollCarta("epica", state);
      if (epica) cartas.push(epica);
    }
    return cartas;
  }

  if (acertos >= total - 1) {
    const comum = rollCarta("comum", state);
    if (comum) cartas.push(comum);
    if (Math.random() < 0.4) {
      const rara = rollCarta("rara", state);
      if (rara) cartas.push(rara);
    }
    return cartas;
  }

  if (acertos >= total / 2) {
    if (Math.random() < 0.7) {
      const comum = rollCarta("comum", state);
      if (comum) cartas.push(comum);
    }
    return cartas;
  }

  if (Math.random() < 0.4) {
    const comum = rollCarta("comum", state);
    if (comum) cartas.push(comum);
  }
  return cartas;
}
