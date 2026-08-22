//#region node_modules/.nitro/vite/services/ssr/assets/fleet-BFcBnVZD.js
var SHIP_DEFS = [
	{
		key: "carrier",
		name: "Porta-aviões",
		size: 5,
		armor: 1,
		desc: "Coração da frota. Enorme, lento e blindado."
	},
	{
		key: "battleship",
		name: "Encouraçado",
		size: 4,
		armor: 2,
		desc: "Blindagem pesada: cada seção resiste a dois impactos."
	},
	{
		key: "cruiser",
		name: "Cruzador",
		size: 3,
		armor: 1,
		desc: "Equilíbrio entre poder e mobilidade."
	},
	{
		key: "submarine",
		name: "Submarino",
		size: 3,
		armor: 1,
		desc: "Difícil de detectar sem sonar."
	},
	{
		key: "frigate",
		name: "Fragata",
		size: 2,
		armor: 1,
		desc: "Patrulha rápida de escolta."
	},
	{
		key: "destroyer",
		name: "Contratorpedeiro",
		size: 2,
		armor: 1,
		desc: "Caçador ágil de submarinos."
	},
	{
		key: "patrol",
		name: "Navio patrulha",
		size: 1,
		armor: 1,
		desc: "Pequeno, veloz e quase invisível."
	}
];
/** Which ships enter the fleet for a given board size. */
function fleetForSize(size) {
	if (size <= 8) return SHIP_DEFS.filter((s) => [
		"battleship",
		"cruiser",
		"submarine",
		"frigate",
		"patrol"
	].includes(s.key));
	if (size <= 10) return SHIP_DEFS.filter((s) => s.key !== "destroyer");
	return [...SHIP_DEFS, {
		...SHIP_DEFS[4],
		key: "frigate"
	}];
}
var ABILITIES = [
	{
		key: "radar",
		name: "Radar avançado",
		desc: "Varre uma área 3x3 e informa quantas seções inimigas existem nela.",
		cooldown: 4,
		icon: "radar",
		targeted: true
	},
	{
		key: "sonar",
		name: "Sonar",
		desc: "Revela a posição exata de uma seção inimiga em uma linha.",
		cooldown: 6,
		icon: "waves",
		targeted: true
	},
	{
		key: "missile",
		name: "Míssil guiado",
		desc: "Atinge a célula alvo e uma célula adjacente aleatória.",
		cooldown: 5,
		icon: "rocket",
		targeted: true
	},
	{
		key: "airstrike",
		name: "Ataque aéreo",
		desc: "Bombardeia uma linha de 3 células na horizontal.",
		cooldown: 7,
		icon: "plane",
		targeted: true
	},
	{
		key: "smoke",
		name: "Cortina de fumaça",
		desc: "Reduz a precisão inimiga durante 2 turnos.",
		cooldown: 6,
		icon: "cloud",
		targeted: false
	},
	{
		key: "drone",
		name: "Drone de reconhecimento",
		desc: "Revela 3 células vazias garantidas ao redor do alvo.",
		cooldown: 5,
		icon: "drone",
		targeted: true
	}
];
var MAPS = [
	{
		key: "mar_aberto",
		name: "Mar Aberto",
		desc: "Sem obstáculos. Estratégia pura.",
		obstacles: 0,
		palette: "oceano"
	},
	{
		key: "arquipelago",
		name: "Arquipélago",
		desc: "Pequenas ilhas dispersas.",
		obstacles: 5,
		palette: "tropical"
	},
	{
		key: "vulcanica",
		name: "Ilha Vulcânica",
		desc: "Rochas e fumaça no centro.",
		obstacles: 4,
		palette: "vulcao"
	},
	{
		key: "costa",
		name: "Costa Rochosa",
		desc: "Faróis e recifes nas bordas.",
		obstacles: 6,
		palette: "costa"
	},
	{
		key: "polar",
		name: "Região Polar",
		desc: "Blocos de gelo à deriva.",
		obstacles: 5,
		palette: "polar"
	},
	{
		key: "tropical",
		name: "Mar Tropical",
		desc: "Boias e plataformas marítimas.",
		obstacles: 4,
		palette: "tropical"
	}
];
var DIFFICULTIES = [
	{
		key: "muito_facil",
		name: "Muito Fácil",
		desc: "Tiros quase aleatórios."
	},
	{
		key: "facil",
		name: "Fácil",
		desc: "Persegue acertos de forma simples."
	},
	{
		key: "normal",
		name: "Normal",
		desc: "Usa mapa de calor e caça em cruz."
	},
	{
		key: "dificil",
		name: "Difícil",
		desc: "Prioriza alvos e usa radar."
	},
	{
		key: "especialista",
		name: "Especialista",
		desc: "Busca por paridade e habilidades."
	},
	{
		key: "almirante",
		name: "Almirante Supremo",
		desc: "Lê seus padrões e não erra por acaso."
	}
];
//#endregion
export { fleetForSize as a, SHIP_DEFS as i, DIFFICULTIES as n, MAPS as r, ABILITIES as t };
