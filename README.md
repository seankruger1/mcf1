# Participant Voice and Text Capture Site

A GitHub ready Vite + React project for participant interviews. Demographics use structured fields, while open ended responses can be captured with text, voice notes, or both.

## What this version does
- Consent and language preference screen
- Demographic dropdown fields
- Explore, Engage, and Accelerate interview sections
- Text responses saved in local browser storage
- Voice note recording in browser
- JSON export for pilot testing
- Responsive layout for laptop or mobile browser use

## Important limitation
This is a front end prototype only.

- Text responses are stored in the participant's browser using local storage.
- Voice notes are stored only in the current browser session.
- Nothing is saved to a central database yet.

For real field use, connect it to a backend such as Supabase, Firebase, or a UP hosted service.

## Run locally
```bash
npm install
npm run dev
```

## Build for production
```bash
npm run build
```

## Upload to GitHub
```bash
git init
git add .
git commit -m "Initial participant site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/participant-voice-text-site.git
git push -u origin main
```

## Deploy
Recommended:
- Vercel
- Netlify

Both can import this repository directly.

## Next recommended upgrade
Add:
- central database storage
- secure voice file upload
- consent logging
- privacy notice
- researcher admin dashboard
