// Vercel rejects any serverless request whose body exceeds 4.5 MB. The request
// never reaches our code, so the browser gets a bare 413 and none of our error
// messages — which is why the editors must check sizes *before* sending.
//
// The gallery posts every new image in one request, so the per-request total
// matters as much as the per-file size. Both ceilings sit below 4.5 MB to leave
// room for the text fields and multipart overhead.
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

export const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Message explaining why these files can't be uploaded together, or null if
 * they fit. Used by the editors (before posting) and by the API routes.
 */
export function checkUploadSize(files: (File | null | undefined)[]): string | null {
  const picked = files.filter((f): f is File => f instanceof File && f.size > 0);

  const tooBig = picked.find((f) => f.size > MAX_FILE_BYTES);
  if (tooBig) {
    return `«${tooBig.name}» pesa ${formatMB(tooBig.size)} y el máximo por archivo es ${formatMB(
      MAX_FILE_BYTES
    )}. Redúcelo de tamaño o resolución antes de subirlo.`;
  }

  const total = picked.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return `Los archivos suman ${formatMB(total)} y el máximo por guardado es ${formatMB(
      MAX_TOTAL_BYTES
    )}. Sube menos imágenes a la vez: guarda, y repite con las siguientes.`;
  }

  return null;
}
