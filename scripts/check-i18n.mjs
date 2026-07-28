// Paridad de claves entre `es` y `en` en el contenido de las páginas de servicio.
//
// POR QUÉ EXISTE: los bloques nuevos de `ServicioDetalle` son OPCIONALES, así que
// TypeScript no exige que un bloque declarado en `es` exista también en `en`. El
// fallo no es un error de compilación, es silencioso: la página inglesa queda con
// menos secciones que la española y nadie se entera hasta que la visita alguien.
//
//   node scripts/check-i18n.mjs
//
// No necesita variables de entorno ni red. Sale con código 1 si hay divergencia.

import { readFileSync } from 'node:fs';

// El archivo es TypeScript y Node no lo importa sin transpilar, así que leemos
// las claves declaradas directamente del fuente. Depende de la indentación del
// archivo (2/4/6 espacios), que es la que respeta todo el repo.
const SRC = new URL('../src/i18n/content/servicios-detalle.ts', import.meta.url);
const source = readFileSync(SRC, 'utf8');

/** Extrae { servicio: [claves...] } de un bloque de idioma. */
function parseLangBlock(text, lang) {
  const start = text.indexOf(`\n  ${lang}: {`);
  if (start === -1) throw new Error(`No encuentro el bloque "${lang}"`);
  // El bloque termina en la primera línea que sea exactamente "  },"
  const rest = text.slice(start + 1);
  const end = rest.indexOf('\n  },');
  const block = rest.slice(0, end);

  const services = {};
  let current = null;
  for (const raw of block.split('\n')) {
    const line = raw.replace(/\r$/, '');
    const svc = line.match(/^    '([a-z-]+)': \{/);
    if (svc) { current = svc[1]; services[current] = []; continue; }
    if (line === '    },') { current = null; continue; }
    // \w para que p1/p2 no se escapen: [a-zA-Z] deja fuera los dígitos.
    const key = line.match(/^      (\w+):/);
    if (current && key) services[current].push(key[1]);
  }
  return services;
}

const es = parseLangBlock(source, 'es');
const en = parseLangBlock(source, 'en');

let failed = false;
const services = [...new Set([...Object.keys(es), ...Object.keys(en)])];

for (const svc of services) {
  const a = new Set(es[svc] ?? []);
  const b = new Set(en[svc] ?? []);
  const onlyEs = [...a].filter(k => !b.has(k));
  const onlyEn = [...b].filter(k => !a.has(k));

  if (onlyEs.length || onlyEn.length) {
    failed = true;
    console.error(`✗ ${svc}`);
    if (onlyEs.length) console.error(`    solo en es: ${onlyEs.join(', ')}`);
    if (onlyEn.length) console.error(`    solo en en: ${onlyEn.join(', ')}`);
  } else {
    console.log(`✓ ${svc} — ${a.size} campos en los dos idiomas`);
  }
}

if (failed) {
  console.error('\nLos dos idiomas no declaran los mismos bloques: una de las dos páginas saldría más corta.');
  process.exit(1);
}
console.log('\nParidad es/en correcta.');
