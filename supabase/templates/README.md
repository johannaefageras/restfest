# Mail texts

The three mails Supabase Auth sends for the accounts, in Swedish (HANDOFF.md, "Konton och receptbok").
Supabase's own defaults are in English.

They are pasted into the Supabase dashboard by hand: Authentication → Emails → Templates. Don't apply
them with `supabase config push`: it sends the whole local configuration and would overwrite the
project's other sign-in settings.

| File | Template in the dashboard | Subject |
| --- | --- | --- |
| `confirmation.html` | Confirm signup | Bekräfta din e-postadress hos Ofta bra efter |
| `recovery.html` | Reset password | Välj ett nytt lösenord |
| `email_change.html` | Change email address | Bekräfta din nya e-postadress |

`{{ .ConfirmationURL }}`, `{{ .Email }}` and `{{ .NewEmail }}` are Supabase's own placeholders; leave
them as they are.
