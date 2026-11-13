// Who is calling: the signed-in visitor behind a request, if there is one.
//
// The functions are public (verify_jwt is off in config.toml), so a sign-in is optional and checked
// here: the site sends the visitor's access token in the Authorization header (src/js/account.js).
import {db} from './db.ts';

export interface Caller {
  id: string;
}

// The user the request's access token belongs to, or null: no token, an expired or made-up one, or
// Supabase Auth out of reach. Never throws, so a bad token is handled like no token.
export async function userFor(req: Request): Promise<Caller | null> {
  const token = req.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!token) return null;
  try {
    const {data, error} = await db.auth.getUser(token);
    return !error && data.user?.id ? {id: data.user.id} : null;
  } catch (error) {
    console.warn('Could not check the sign-in:', error);
    return null;
  }
}
