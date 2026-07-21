# xr-discovery

Landing page **XR VR Discovery** : animation VR clé en main (Meta Quest 3) pour
centres commerciaux & retail à Antananarivo.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript strict · CSS Modules + CSS
moderne natif · framer-motion · Lenis (smooth scroll) · react-hook-form + Zod ·
Resend (leads).

## Développement

```bash
npm install
npm run dev
```

Contrôles avant commit (dans cet ordre) :

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Configuration

Copier `.env.example` vers `.env.local` et renseigner les clés (envoi des leads
via Resend). Sans ces variables, la Server Action journalise le lead côté
serveur au lieu de l'envoyer par email.
