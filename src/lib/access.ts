import { getSession } from 'auth-astro/server';
import { sanityClient } from 'sanity:client';

/** The verified Google email of the current session, or null if logged out. */
export async function getSessionEmail(request: Request): Promise<string | null> {
  const session = await getSession(request);
  return session?.user?.email ?? null;
}

/** True if the email belongs to a team member flagged as a project editor. */
export async function isProjectEditor(email: string | null): Promise<boolean> {
  if (!email) return false;
  const count = await sanityClient.fetch<number>(
    `count(*[_type == "person" && lower(email) == lower($email) && canEditProjects == true])`,
    { email }
  );
  return count > 0;
}
