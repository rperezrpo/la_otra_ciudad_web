import { defineConfig } from 'auth-astro';
import Google from '@auth/core/providers/google';

// Only Google Workspace accounts on this domain may sign in.
const ALLOWED_DOMAIN = 'laotraciudad.org';

export default defineConfig({
  // Read explicitly so the secret is always set regardless of how the module
  // is bundled. trustHost is required behind Vercel's proxy.
  secret: import.meta.env.AUTH_SECRET,
  trustHost: true,
  // Surfaces the real Auth.js error in the server logs instead of the generic
  // "problem with the server configuration" message.
  debug: true,
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
      // Pre-filter the Google account chooser to the corporate Workspace.
      authorization: {
        params: { hd: ALLOWED_DOMAIN, prompt: 'select_account' },
      },
    }),
  ],
  callbacks: {
    // Hard server-side gate: reject anything that isn't a verified
    // @laotraciudad.org account, no matter what Google returns.
    signIn({ profile }) {
      return Boolean(
        profile?.email_verified &&
          profile.email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)
      );
    },
  },
});
