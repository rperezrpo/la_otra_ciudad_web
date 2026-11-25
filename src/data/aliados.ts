// Allies, funders and clients shown as logo walls (Quiénes somos, Servicios).
//
// EDIT: to add an ally, drop the logo in /public/images/allies/ and add a row here.
// - Trim the empty margins around the logo before saving it (the tiles add their own padding).
// - `ratio` is the logo's width ÷ height after trimming. The gallery uses it to give every
//   logo roughly the same visual weight, so wide wordmarks don't dwarf square emblems.

export interface Aliado {
  name: string;
  logo: string;
  ratio: number;
}

export const ALIADOS: Aliado[] = [
  { name: 'Fundación Mi Sangre',  logo: '/images/allies/mi-sangre.webp',          ratio: 0.60 },
  { name: 'S2Cities',             logo: '/images/allies/s2cities.webp',           ratio: 2.59 },
  { name: 'Everyday Homeless',    logo: '/images/allies/everyday-homeless.webp',  ratio: 1.86 },
  { name: 'UCL Bartlett (DPU)',   logo: '/images/allies/dpu.webp',                ratio: 1.95 },
  { name: 'Urbam–EAFIT',          logo: '/images/allies/urbam.webp',              ratio: 2.94 },
  { name: 'Somos x Naturaleza',   logo: '/images/allies/somos-x-naturaleza.webp', ratio: 3.27 },
  { name: 'ETH Zurich',           logo: '/images/allies/eth-zurich.webp',         ratio: 6.00 },
  { name: 'Proyecto NN',          logo: '/images/allies/proyecto-nn.webp',        ratio: 1.00 },
  { name: 'intuyLab',             logo: '/images/allies/intuylab.webp',           ratio: 0.69 },
  { name: 'Alcaldía de Medellín', logo: '/images/allies/alcaldia-medellin.webp',  ratio: 1.44 },
  { name: 'Alcaldía de Envigado', logo: '/images/allies/alcaldia-envigado.webp',  ratio: 2.49 },
  { name: 'UMI Fund',             logo: '/images/allies/umi.webp',                ratio: 1.19 },
  { name: 'Social Change Nest',   logo: '/images/allies/social-change-nest.webp', ratio: 2.32 },
  { name: 'Parque Explora',       logo: '/images/allies/parque-explora.webp',     ratio: 1.82 },
  { name: 'Low Carbon City',      logo: '/images/allies/low-carbon-city.webp',    ratio: 1.49 },
  // Active Play Challenge partners
  { name: 'Novo Nordisk',         logo: '/images/allies/novo-nordisk.webp',       ratio: 3.43 },
  { name: 'RMIT University',      logo: '/images/allies/rmit.webp',               ratio: 2.88 },
  { name: 'Arup',                 logo: '/images/allies/arup.webp',               ratio: 3.77 },
  { name: 'Right To Play',        logo: '/images/allies/right-to-play.webp',      ratio: 4.93 },
  { name: 'Save the Children',    logo: '/images/allies/save-the-children.svg',   ratio: 3.87 },
  { name: 'Van Leer Foundation',  logo: '/images/allies/van-leer.webp',           ratio: 3.06 },
];

export const aliadoPorNombre = (name: string): Aliado => {
  const a = ALIADOS.find((x) => x.name === name);
  if (!a) throw new Error(`Aliado desconocido: ${name}`);
  return a;
};

/**
 * Logo height (px) that gives every logo about the same area inside a tile,
 * clamped so tall emblems don't overflow and long wordmarks stay legible.
 */
export const alturaLogo = (ratio: number, area = 4800): number =>
  Math.round(Math.min(68, Math.max(28, Math.sqrt(area / ratio))));
