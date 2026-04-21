export type Question = {
  a: number;
  b: number;
  answer: number;
};

export const TABUADAS_DISPONIVEIS = [2, 3, 4, 5, 6, 7, 8, 9] as const;
export type Tabuada = (typeof TABUADAS_DISPONIVEIS)[number];

export type Modo = "sequencial" | "aleatorio";

export const TABUADAS_DIFICEIS: Tabuada[] = [6, 7, 8, 9];

export function isTabuadaDificil(t: Tabuada): boolean {
  return TABUADAS_DIFICEIS.includes(t);
}

export function generateSession(
  tabuada: Tabuada,
  modo: Modo = "aleatorio",
  size = 10
): Question[] {
  const base: Question[] = [];
  for (let b = 1; b <= 10; b++) {
    base.push({ a: tabuada, b, answer: tabuada * b });
  }
  if (modo === "sequencial") {
    return base.slice(0, size);
  }
  const shuffled = [...base].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
}
