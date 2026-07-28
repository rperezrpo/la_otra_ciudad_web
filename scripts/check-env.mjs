#!/usr/bin/env node
// Comprueba que las variables que el sitio necesita EN TIEMPO DE EJECUCIÓN
// existen en Vercel, y que las locales existen en .env.
//
// Existe porque las dos cosas pueden divergir en silencio: en julio de 2026 los
// editores llevaban tiempo rotos porque SANITY_WRITE_TOKEN estaba solo en .env
// y nunca se añadió a Vercel. Nada lo detectaba.
//
//   npm run check:env
//
// Requiere estar autenticado en el CLI de Vercel (`npx vercel login`) y que el
// proyecto esté enlazado (`npx vercel link`).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// Variables que consumen las rutas /api/* al ejecutarse: deben estar en Vercel.
const REQUIRED_IN_VERCEL = {
  SANITY_WRITE_TOKEN: 'editores de proyectos y perfil (escritura en Sanity)',
  AUTH_SECRET: 'sesiones de Google (Auth.js)',
  GOOGLE_CLIENT_ID: 'inicio de sesión de Google',
  GOOGLE_CLIENT_SECRET: 'inicio de sesión de Google',
  RESEND_API_KEY: 'formulario de contacto (/api/contact)',
  WOMPI_PUBLICA: 'donaciones (/api/donate)',
  WOMPI_INTEGRITY: 'donaciones (/api/donate)',
};

// Variables que solo usan los scripts de scripts/, desde tu máquina.
const REQUIRED_LOCALLY = {
  PUBLIC_SANITY_PROJECT_ID: 'scripts de importación y migración',
  PUBLIC_SANITY_DATASET: 'scripts de importación y migración',
  SANITY_WRITE_TOKEN: 'scripts de importación y migración',
};

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

let failed = false;

// ─── Vercel ──────────────────────────────────────────────────────────────────
console.log('\nVariables requeridas en Vercel (runtime)\n');

let vercelOutput = '';
try {
  vercelOutput = execFileSync('npx', ['vercel', 'env', 'ls'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });
} catch (err) {
  console.log(red('  No se pudo consultar Vercel.'));
  console.log(dim('  Ejecuta `npx vercel login` y `npx vercel link` primero.'));
  console.log(dim(`  ${String(err.message).split('\n')[0]}`));
  process.exit(1);
}

for (const [name, purpose] of Object.entries(REQUIRED_IN_VERCEL)) {
  // `vercel env ls` imprime UNA FILA POR ENTORNO, así que hay que mirarlas todas:
  //   "NOMBRE  Encrypted  Preview     ..."
  //   "NOMBRE  Encrypted  Production  ..."
  const rows = vercelOutput.split('\n').filter((l) => new RegExp(`^\\s*${name}\\s`).test(l));
  if (!rows.length) {
    console.log(`  ${red('FALTA')}  ${name}  ${dim(`— ${purpose}`)}`);
    failed = true;
  } else if (!rows.some((r) => /Production/.test(r))) {
    console.log(`  ${yellow('PARCIAL')} ${name}  ${dim('— existe pero no en Production')}`);
    failed = true;
  } else {
    console.log(`  ${green('ok')}     ${name}`);
  }
}

// ─── .env local ──────────────────────────────────────────────────────────────
console.log('\nVariables requeridas en .env (scripts locales)\n');

if (!existsSync('.env')) {
  console.log(`  ${yellow('sin .env')} ${dim('— necesario solo para ejecutar los scripts de scripts/')}`);
} else {
  const localNames = new Set(
    readFileSync('.env', 'utf8')
      .split('\n')
      .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)$/))
      .filter((m) => m && m[2].trim())
      .map((m) => m[1])
  );
  for (const [name, purpose] of Object.entries(REQUIRED_LOCALLY)) {
    if (localNames.has(name)) console.log(`  ${green('ok')}     ${name}`);
    else {
      console.log(`  ${red('FALTA')}  ${name}  ${dim(`— ${purpose}`)}`);
      failed = true;
    }
  }
}

console.log(
  failed
    ? `\n${red('Hay variables sin configurar.')} Añádelas antes de desplegar.\n` +
        dim('  Vercel: Settings → Environment Variables (y redespliega: los cambios solo entran al desplegar).\n')
    : `\n${green('Todo configurado.')}\n`
);

process.exit(failed ? 1 : 0);
