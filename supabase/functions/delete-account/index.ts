// POST (signed in) → {deleted: true}
//
// Deletes the caller's account, from konto.html. The database removes their profile and recipe book
// with it (on delete cascade, supabase/migrations/…_accounts.sql). Recipes they generated stay: those
// were never tied to the person, only listed in their book.
import {userFor} from '../_shared/auth.ts';
import {db} from '../_shared/db.ts';
import {serve, VisitorError} from '../_shared/http.ts';

serve(['POST'], async req => {
  const user = await userFor(req);
  if (!user) throw new VisitorError(401, 'Du behöver vara inloggad.');
  const {error} = await db.auth.admin.deleteUser(user.id);
  if (error) throw error;
  return {deleted: true};
});
