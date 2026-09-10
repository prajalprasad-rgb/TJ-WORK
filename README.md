# Wedify Royal Wedding Invitation

A production-ready, config-driven Next.js wedding invitation with a scratch reveal, optional music, live maps, countdowns, calendar links, five-image lightbox, RSVP flow, and responsive mobile layouts.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Verify production output with `npm run build`.

## Customize the wedding

All names, family details, dates, venues, maps, image crop positions, brand details, verse, music path, and share copy live in `app/config.ts`.

Replace assets in:

- `public/images/`
- `public/logos/`
- `public/audio/wedding-theme.mp3`
- `public/og/wedding-preview.jpg`

The included audio file is only a placeholder. Add a properly licensed MP3 before launch.

## Google Sheets RSVP setup

1. Create a Google Sheet with these headers in row 1: `Name`, `Number of Guests`, `Attendance`, `Event Selection`, `Engagement`, `Wedding`, `Submission Timestamp`, `Normalized Name`.
2. Open **Extensions → Apps Script** and paste `google-apps-script.gs`.
3. Deploy as a Web App, executing as yourself and allowing access to anyone with the link.
4. Copy `.env.example` to `.env.local` and set `GOOGLE_SHEETS_WEBHOOK_URL` to the deployment URL.
5. Redeploy the Next.js app.

The browser uses `localStorage` to discourage repeat submissions. The Apps Script also rejects duplicate normalized names. When the environment variable is absent, the API returns success in demo mode so the complete interface can be previewed.

## Deployment notes

- Set the real public URL in `app/layout.tsx` under `metadataBase`.
- Replace placeholder brand links and contacts in `app/config.ts`.
- Verify all map pins and timezone-aware ISO date strings.
- Test the WhatsApp preview after deployment; social platforms cache metadata.
- Use licensed, compressed AVIF/WebP/JPEG photographs and a licensed audio track before launch.
