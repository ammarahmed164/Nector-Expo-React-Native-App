# Bird SMS Setup

Project: `itongowuivcufubjqkyd`

## Already done (automated)

- Edge Function `send-sms` deployed with Bird API + hook secret fallbacks
- SQL hook `public.send_sms()` created (pg_net → Bird API)
- Backend sends SMS via Bird directly (`provider: bird`)
- Secrets file: `supabase/functions/.env` (gitignored)

## One command left (needs Supabase login once)

Phone provider + Auth hook require Supabase **Personal Access Token** (not service role):

```powershell
cd c:\Users\DELL\Documents\grocery-app
npx supabase login
node scripts/setup-supabase-bird.mjs
```

This enables:
- Phone provider
- Send SMS Hook → edge function
- Edge function secrets (if CLI works)

## Manual alternative (Dashboard)

1. **Edge Functions → Secrets** — add from `supabase/functions/.env`
2. **Auth → Hooks → Send SMS** — URL: `https://itongowuivcufubjqkyd.supabase.co/functions/v1/send-sms`, Secret: from `.env`
3. **Auth → Providers → Phone** — Enable ON

## Bird wallet

Top up Bird wallet — error `402 WalletInsufficientBalance` blocks SMS.

## Test

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/auth/send-otp" -Method POST -ContentType "application/json" -Body '{"dial":"+92","phone":"YOUR_NUMBER"}'
```

Success: `"provider":"bird"`, no `"code"` in response.
