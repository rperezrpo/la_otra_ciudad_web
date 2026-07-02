// Strings de UI compartidos en todo el sitio (nav, footer, botones comunes,
// piezas de proyecto). El contenido largo de cada página vive en
// src/i18n/content/<page>.ts.

export const LOCALES = ['es', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'es';

/** Rutas que solo existen en español (herramientas internas de editores). */
export const ES_ONLY_PREFIXES = ['/proyectos/editar', '/equipo/editar', '/admin', '/report-mockups'];

/** `/quienes-somos` → `/en/quienes-somos`; en español devuelve el path tal cual. */
export function localizePath(lang: Lang, path: string): string {
  if (lang === 'es') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

/** Path equivalente en el otro idioma, a partir del pathname actual. */
export function alternatePath(pathname: string, currentLang: Lang): string {
  if (currentLang === 'en') {
    const stripped = pathname.replace(/^\/en(\/|$)/, '/');
    return stripped || '/';
  }
  return localizePath('en', pathname);
}

export function langFromUrl(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

export const ui = {
  es: {
    'nav.quienesSomos': 'Quiénes Somos',
    'nav.proyectos': 'Proyectos',
    'nav.metodologia': 'Metodología',
    'nav.servicios': 'Servicios',
    'nav.contacto': 'Contacto',
    'nav.donar': 'Donar ↗',
    'nav.donarAria': 'Donar',
    'nav.abrirMenu': 'Abrir menú',
    'nav.cerrarMenu': 'Cerrar menú',
    'nav.cambiarIdioma': 'Switch to English',

    'footer.organizacion': 'Organización',
    'footer.involucrate': 'Involúcrate',
    'footer.tagline': 'Co-creando ciudades más justas, sostenibles y saludables en Colombia.',
    'footer.copyright': '© 2026 Corporación La Otra Ciudad · Medellín, Colombia',

    'project.todos': 'Todos',
    'project.volver': '← Todos los proyectos',
    'project.territorio': 'Territorio',
    'project.ano': 'Año',
    'project.aliados': 'Aliados',
    'project.galeria': 'Galería',
    'project.ctaTitulo': '¿Te interesa este trabajo?',
    'project.ctaApoya': 'Apoya nuestro trabajo',
    'project.ctaHablemos': 'Hablemos →',

    'cta.quieroDonar': 'Quiero donar',
    'cta.quieroParticipar': 'Quiero participar',
  },
  en: {
    'nav.quienesSomos': 'About Us',
    'nav.proyectos': 'Projects',
    'nav.metodologia': 'Methodology',
    'nav.servicios': 'Services',
    'nav.contacto': 'Contact',
    'nav.donar': 'Donate ↗',
    'nav.donarAria': 'Donate',
    'nav.abrirMenu': 'Open menu',
    'nav.cerrarMenu': 'Close menu',
    'nav.cambiarIdioma': 'Cambiar a español',

    'footer.organizacion': 'Organization',
    'footer.involucrate': 'Get involved',
    'footer.tagline': 'Co-creating fairer, more sustainable and healthier cities in Colombia.',
    'footer.copyright': '© 2026 Corporación La Otra Ciudad · Medellín, Colombia',

    'project.todos': 'All',
    'project.volver': '← All projects',
    'project.territorio': 'Territory',
    'project.ano': 'Year',
    'project.aliados': 'Partners',
    'project.galeria': 'Gallery',
    'project.ctaTitulo': 'Interested in this work?',
    'project.ctaApoya': 'Support our work',
    'project.ctaHablemos': "Let's talk →",

    'cta.quieroDonar': 'Donate',
    'cta.quieroParticipar': 'Get involved',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[DEFAULT_LANG][key];
  };
}

/** Locale actual de una página Astro (Astro.currentLocale tipado, con fallback). */
export function pageLang(currentLocale: string | undefined): Lang {
  return currentLocale === 'en' ? 'en' : 'es';
}
