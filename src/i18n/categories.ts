// Categorías y estados de proyecto: los documentos de Sanity guardan la CLAVE
// estable; el label visible se traduce una sola vez aquí (nunca por documento).
import type { Lang } from './ui';

export type CategoryKey = keyof typeof CATEGORY_META;

export const CATEGORY_META = {
  'paisajes-regenerativos': {
    es: 'Paisajes Regenerativos',
    en: 'Regenerative Landscapes',
    color: 'aguamarina',
  },
  'espacio-publico': {
    es: 'Espacio Público',
    en: 'Public Space',
    color: 'cobalto',
  },
  'acompanamiento-comunitario': {
    es: 'Acompañamiento Comunitario',
    en: 'Community Support',
    color: 'violeta',
  },
} as const;

export const CATEGORY_KEYS = Object.keys(CATEGORY_META) as CategoryKey[];

export const STATUS_LABELS = {
  activo:     { es: 'activo',     en: 'active' },
  completado: { es: 'completado', en: 'completed' },
} as const;

/** Label español viejo → clave estable (para datos aún no migrados). */
const LEGACY_CATEGORY_TO_KEY: Record<string, CategoryKey> = {
  'Paisajes Regenerativos':      'paisajes-regenerativos',
  'Espacio Público':             'espacio-publico',
  'Acompañamiento Comunitario':  'acompanamiento-comunitario',
};

/** Normaliza un valor de categoría de Sanity (clave nueva o label legacy) a la clave estable. */
export function categoryKey(value: string | undefined | null): CategoryKey | '' {
  if (!value) return '';
  if (value in CATEGORY_META) return value as CategoryKey;
  return LEGACY_CATEGORY_TO_KEY[value] ?? '';
}

export function categoryLabel(value: string | undefined | null, lang: Lang): string {
  const key = categoryKey(value);
  return key ? CATEGORY_META[key][lang] : (value ?? '');
}

export function statusLabel(status: string | undefined | null, lang: Lang): string {
  if (!status) return '';
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS]?.[lang] ?? status;
}
