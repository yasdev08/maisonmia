# Maison Mia — page lien premium (Next.js)

## Installer et lancer
```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run test:config          # vérifie numéros, WhatsApp, tel:, réseaux, Maps
```

## Le logo (obligatoire)
Copiez le logo original ici : `public/images/maison-mia-logo.png` (PNG, idéalement fond transparent,
~800 px de large). Le site lit ses dimensions réelles : aucun étirement.
Si le fichier est absent, un en-tête typographique « Maison Mia » s'affiche à la place.
Si votre fichier montre un damier gris/blanc, c'est un faux fond transparent : détourez-le d'abord.
Favicon : remplacez `app/icon.tsx` par un `app/icon.png` tiré du logo.

## Tout modifier au même endroit
`lib/site-config.ts` : textes, numéros, Maps, réseaux, horaires, prestations, couleurs.
Une valeur vide masque automatiquement le bouton ou la section.

## Déployer sur Vercel
1. Poussez le dossier sur GitHub.
2. vercel.com > Add New > Project : importez le dépôt (Next.js détecté).
3. Settings > Environment Variables : `NEXT_PUBLIC_SITE_URL` = `https://votre-domaine`
   (URL canonique et aperçus WhatsApp/Facebook).
4. Deploy, puis ajoutez le domaine dans Settings > Domains.

## À demander à la propriétaire
- Horaires d'ouverture, adresse postale (rue), prestations et prix si affichés
- Logo original haute résolution (fond transparent)
- Confirmation des comptes Instagram / Facebook / TikTok
- Nom de domaine souhaité, photos réelles pour une future galerie
