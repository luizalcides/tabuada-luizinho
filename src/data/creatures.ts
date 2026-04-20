export type Rarity = "comum" | "rara" | "epica" | "lendaria";

export type Creature = {
  id: string;
  nome: string;
  grupo: "ave" | "marinho";
  emoji: string;
  raridade: Rarity;
  curiosidade: string;
};

export function getArteUrl(id: string): string {
  return `./cartas/${id}.png`;
}

export const RARIDADE_ORDEM: Rarity[] = ["comum", "rara", "epica", "lendaria"];

export const RARIDADE_LABEL: Record<Rarity, string> = {
  comum: "Comum",
  rara: "Rara",
  epica: "Épica",
  lendaria: "Lendária",
};

export const RARIDADE_COR: Record<Rarity, string> = {
  comum: "#5c9cc7",
  rara: "#8a5cc7",
  epica: "#d4a017",
  lendaria: "#e6558f",
};

export const CREATURES: Creature[] = [
  // Aves comuns (12)
  { id: "bemtevi", nome: "Bem-te-vi", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "O bem-te-vi canta o próprio nome! Ele é muito comum nas cidades do Brasil." },
  { id: "sabia", nome: "Sabiá-laranjeira", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "É a ave símbolo do Brasil. Seu canto é considerado um dos mais bonitos do mundo." },
  { id: "pardal", nome: "Pardal", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Pardais andam em grupos e podem viver até em grandes cidades." },
  { id: "pombo", nome: "Pombo-correio", grupo: "ave", emoji: "🕊️", raridade: "comum", curiosidade: "Pombos já foram usados para enviar cartas a longas distâncias!" },
  { id: "andorinha", nome: "Andorinha", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Andorinhas viajam milhares de quilômetros toda primavera." },
  { id: "joaodebarro", nome: "João-de-barro", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Constrói casinhas de barro com duas salas, igual um apartamento!" },
  { id: "canario", nome: "Canário-da-terra", grupo: "ave", emoji: "🐤", raridade: "comum", curiosidade: "Tem peito amarelo brilhante e gosta de comer sementes." },
  { id: "quero", nome: "Quero-quero", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Protege seu ninho fingindo estar com a asa quebrada para enganar predadores." },
  { id: "curio", nome: "Curió", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Pássaro pequeno com canto forte e melodioso." },
  { id: "rolinha", nome: "Rolinha", grupo: "ave", emoji: "🕊️", raridade: "comum", curiosidade: "Faz seu ninho com só alguns gravetos — é bem simples!" },
  { id: "tico", nome: "Tico-tico", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Tem um topete na cabeça e é amigo das pessoas em praças e quintais." },
  { id: "sanhaco", nome: "Sanhaço", grupo: "ave", emoji: "🐦", raridade: "comum", curiosidade: "Tem penas azul-cinza e adora comer frutas maduras." },
  // Marinhos comuns (12)
  { id: "peixepalhaco", nome: "Peixe-palhaço", grupo: "marinho", emoji: "🐠", raridade: "comum", curiosidade: "Vive dentro de anêmonas sem ser picado — elas o protegem!" },
  { id: "estrela", nome: "Estrela-do-mar", grupo: "marinho", emoji: "⭐", raridade: "comum", curiosidade: "Se perder um braço, consegue crescer outro de novo." },
  { id: "caranguejo", nome: "Caranguejo", grupo: "marinho", emoji: "🦀", raridade: "comum", curiosidade: "Anda de lado porque as patas dobram só para os lados." },
  { id: "camarao", nome: "Camarão", grupo: "marinho", emoji: "🦐", raridade: "comum", curiosidade: "Tem o coração na cabeça, literalmente!" },
  { id: "lula", nome: "Lula", grupo: "marinho", emoji: "🦑", raridade: "comum", curiosidade: "Solta uma tinta escura para fugir de predadores." },
  { id: "sardinha", nome: "Sardinha", grupo: "marinho", emoji: "🐟", raridade: "comum", curiosidade: "Nada em cardumes de milhares — parece uma nuvem prateada no mar." },
  { id: "caramujo", nome: "Caramujo-do-mar", grupo: "marinho", emoji: "🐚", raridade: "comum", curiosidade: "Constrói sua concha em espiral conforme cresce." },
  { id: "agua", nome: "Água-viva", grupo: "marinho", emoji: "🪼", raridade: "comum", curiosidade: "Não tem cérebro nem coração, e é 95% água!" },
  { id: "ourico", nome: "Ouriço-do-mar", grupo: "marinho", emoji: "🦔", raridade: "comum", curiosidade: "Seus espinhos protegem contra predadores famintos." },
  { id: "atum", nome: "Atum", grupo: "marinho", emoji: "🐟", raridade: "comum", curiosidade: "Nada muito rápido — pode chegar a 70 km/h!" },
  { id: "mexilhao", nome: "Mexilhão", grupo: "marinho", emoji: "🦪", raridade: "comum", curiosidade: "Gruda nas pedras com fios que ele mesmo produz." },
  { id: "foca", nome: "Foca", grupo: "marinho", emoji: "🦭", raridade: "comum", curiosidade: "Consegue prender a respiração debaixo d'água por mais de 30 minutos." },

  // Aves raras (8)
  { id: "tucano", nome: "Tucano-toco", grupo: "ave", emoji: "🦜", raridade: "rara", curiosidade: "Seu bico enorme ajuda a regular a temperatura do corpo, igual um ar-condicionado." },
  { id: "beijaflor", nome: "Beija-flor-tesoura", grupo: "ave", emoji: "🐦", raridade: "rara", curiosidade: "Bate as asas 80 vezes por segundo — o único que consegue voar de ré!" },
  { id: "arara", nome: "Arara-vermelha", grupo: "ave", emoji: "🦜", raridade: "rara", curiosidade: "Vive mais de 50 anos e forma pares para a vida toda." },
  { id: "coruja", nome: "Coruja-buraqueira", grupo: "ave", emoji: "🦉", raridade: "rara", curiosidade: "Mora em tocas no chão e gira a cabeça quase 270 graus." },
  { id: "flamingo", nome: "Flamingo", grupo: "ave", emoji: "🦩", raridade: "rara", curiosidade: "A cor rosa vem do que ele come: camarões pequenos!" },
  { id: "gaviao", nome: "Gavião-carcará", grupo: "ave", emoji: "🦅", raridade: "rara", curiosidade: "Esperto, usa ferramentas — às vezes até pedras para quebrar ovos." },
  { id: "pavao", nome: "Pavão", grupo: "ave", emoji: "🦚", raridade: "rara", curiosidade: "Só o macho tem a cauda colorida gigante, usa para impressionar a fêmea." },
  { id: "pelicano", nome: "Pelicano", grupo: "ave", emoji: "🦤", raridade: "rara", curiosidade: "Tem uma bolsa no bico que funciona como rede de pesca." },
  // Marinhos raros (8)
  { id: "polvo", nome: "Polvo", grupo: "marinho", emoji: "🐙", raridade: "rara", curiosidade: "Tem três corações e muda de cor para se esconder em qualquer lugar!" },
  { id: "cavalom", nome: "Cavalo-marinho", grupo: "marinho", emoji: "🐴", raridade: "rara", curiosidade: "É o papai que fica grávido — carrega os filhotes na barriga!" },
  { id: "golfinho", nome: "Golfinho", grupo: "marinho", emoji: "🐬", raridade: "rara", curiosidade: "É muito inteligente, dorme com metade do cérebro por vez." },
  { id: "tubarao", nome: "Tubarão-martelo", grupo: "marinho", emoji: "🦈", raridade: "rara", curiosidade: "A cabeça em formato de martelo dá visão de 360 graus!" },
  { id: "raia", nome: "Raia-manta", grupo: "marinho", emoji: "🐠", raridade: "rara", curiosidade: "Parece voar debaixo d'água com suas 'asas' gigantes." },
  { id: "peixevoador", nome: "Peixe-voador", grupo: "marinho", emoji: "🐟", raridade: "rara", curiosidade: "Consegue saltar da água e planar por até 200 metros no ar." },
  { id: "moreia", nome: "Moreia", grupo: "marinho", emoji: "🐍", raridade: "rara", curiosidade: "Tem duas mandíbulas — uma na boca e outra na garganta!" },
  { id: "peixeespada", nome: "Peixe-espada", grupo: "marinho", emoji: "🗡️", raridade: "rara", curiosidade: "Usa o bico comprido igual uma espada para caçar outros peixes." },

  // Aves épicas (3)
  { id: "araraazul", nome: "Arara-azul", grupo: "ave", emoji: "🦜", raridade: "epica", curiosidade: "Maior papagaio do mundo. Vive no Pantanal e é super rara!" },
  { id: "haspia", nome: "Harpia", grupo: "ave", emoji: "🦅", raridade: "epica", curiosidade: "Uma das águias mais fortes do planeta — caça bichos-preguiça e macacos!" },
  { id: "urubu", nome: "Urubu-rei", grupo: "ave", emoji: "🦅", raridade: "epica", curiosidade: "Tem cabeça colorida com vermelho, amarelo e laranja. É o chefe dos urubus." },
  // Marinhos épicos (3)
  { id: "tartaruga", nome: "Tartaruga-verde", grupo: "marinho", emoji: "🐢", raridade: "epica", curiosidade: "Vive mais de 80 anos e sempre volta à praia onde nasceu para botar ovos!" },
  { id: "orca", nome: "Orca", grupo: "marinho", emoji: "🐋", raridade: "epica", curiosidade: "Também chamada de baleia-assassina, é na verdade o maior golfinho do mundo." },
  { id: "bobobaleia", nome: "Baleia-jubarte", grupo: "marinho", emoji: "🐋", raridade: "epica", curiosidade: "Canta músicas que duram até 20 minutos e podem ser ouvidas a 30 km de distância." },

  // Lendárias (2)
  { id: "baleiaazul", nome: "Baleia-azul", grupo: "marinho", emoji: "🐳", raridade: "lendaria", curiosidade: "O maior animal que já existiu na Terra! Maior que qualquer dinossauro. Seu coração tem o tamanho de um carro." },
  { id: "condor", nome: "Condor-dos-Andes", grupo: "ave", emoji: "🦅", raridade: "lendaria", curiosidade: "Maior ave voadora do mundo — suas asas abertas chegam a 3 metros! Pode planar por horas sem bater as asas." },
];

export function getCreatureById(id: string): Creature | undefined {
  return CREATURES.find((c) => c.id === id);
}

export function getCreaturesByRarity(rarity: Rarity): Creature[] {
  return CREATURES.filter((c) => c.raridade === rarity);
}

export const TOTAL_CARTAS = CREATURES.length;
