# ADF — Site vitrine (adf-go.vercel.app)

Site vitrine d'ADF — Arafat Digital Futuriste (design graphique et vidéo,
Garoua, Cameroun) : présentation des services, portfolio, formation,
boutique du livre, contact. Next.js (App Router), React, Tailwind CSS.
Le contenu public est bilingue FR/EN (dictionnaires `lib/i18n.ts`,
bascule 100 % côté client) ; l'administration est en français.

## Structure

- `app/` — pages (accueil, services, portfolio, formation, contact,
  mentions légales, admin) et routes API.
- `components/home/` — sections de la page d'accueil.
- `components/admin/` — écrans de l'administration (`/admin`, protégée
  par la clé `ADMIN_API_KEY`, patron `lib/admin-auth.ts`).
- `lib/portfolio.ts` — le portfolio vit dans un index JSON sur Vercel
  Blob public (historique du projet ; aucun rapport avec la base
  ci-dessous).

## Avis services et messages de contact — Phase 2 du plan console

Ajoutés le 27 novembre 2026 (plan
`plan-console-admin-boutique-2026-11-27.md`, Phase 2 — volet site ;
le volet boutique, avis produits, est documenté dans le
`docs/ARCHITECTURE.md` de la boutique, §17).

### Ce que ça fait

- **Avis services** : formulaire public dans la section « Avis » de la
  page d'accueil (nom, service concerné — les services réels du site —,
  note de 1 à 5, texte). L'avis naît « en attente » ; seuls les avis
  **approuvés** dans l'administration s'affichent, avec la note moyenne
  et les données structurées schema.org (`Review` +
  `AggregateRating`). L'affichage des étoiles dans Google reste à la
  discrétion de Google ; la conformité technique est ce qui est garanti.
- **Messages** : le formulaire de contact conserve **exactement** son
  comportement d'origine — il compose la demande et ouvre WhatsApp.
  En plus, quand la base est configurée, le message est **enregistré**
  (nom, téléphone — nouveau champ du formulaire —, service, budget,
  message, date, non lu) et se retrouve dans la boîte de réception de
  l'administration, avec réponse WhatsApp en un toucher quand le
  visiteur a laissé son numéro.
- **Administration** : deux sections sous le portfolio — « Avis
  services » (approuver / masquer / remettre en attente / supprimer)
  et « Messages du site » (compteur de non-lus, marquer lu/non lu,
  répondre, supprimer), via `/api/admin/avis` et `/api/admin/messages`,
  gardées par la session administrateur existante.

### Le stockage — et le comportement SANS base

Le site n'avait aucune base de données. `lib/avis-messages.ts` ajoute
une couche Postgres **paresseuse**, sur le patron de la boutique :
pilote `@neondatabase/serverless`, URL lue au premier usage
(`DATABASE_URL` ou `POSTGRES_URL`), schéma créé paresseusement,
tables `avis_services` et `messages_contact`, entités entières en
JSONB.

**Tant que la base n'existe pas — l'état de production actuel — tout
échoue en douceur, par construction :**

- `obtenirDepotSite()` renvoie `null` (aucun appel réseau tenté) ;
- le formulaire de contact garde son comportement d'origine (départ
  WhatsApp, rien d'enregistré ; `POST /api/contact` répond
  `{ enregistre: false }`) ;
- la section « Avis » ne rend **rien** : ni formulaire, ni emplacement
  vide, et `POST /api/avis` répond 503 ;
- les sections d'administration affichent « base non configurée ».

### Activation (action tableau de bord, hors code)

1. Dans le tableau de bord Vercel du projet du site : créer une base
   **Neon** (Postgres) et la connecter au projet — Vercel injecte
   alors `DATABASE_URL` et les variables associées, comme pour la
   boutique le 26 novembre 2026.
2. Redéployer. Aucun changement de code : la couche détecte la base,
   crée ses tables au premier usage, et les avis/messages deviennent
   actifs. La section « Avis » de l'accueil se régénère par
   revalidation périodique (`revalidate = 300` dans `app/page.tsx`) :
   un avis approuvé paraît en quelques minutes, sans redéploiement.

### Anti-abus

- Aucun lien cliquable dans les avis publics : les URL sont
  neutralisées à l'affichage (« lien retiré »), dans le HTML comme
  dans le JSON-LD ; le texte d'origine reste visible dans la file de
  modération.
- Au plus **5 avis et 5 messages par heure et par adresse IP**
  (`lib/limitation.ts` : compteurs en mémoire par processus — sur un
  hébergement multi-instances, la borne réelle est un multiple de la
  borne affichée ; limite distribuée seulement si l'abus devient réel).
- Longueurs bornées côté serveur : avis 1 000 caractères, message
  2 000, nom 100, téléphone 30. Aucun avis public sans approbation.

### Preuves locales (27 novembre 2026, serveurs de production locaux)

- **Sans base** : accueil et contact en 200, aucune trace de la
  section Avis ; `POST /api/contact` → `{ enregistre: false }` ;
  `POST /api/avis` → 503 ; l'administration affiche « base non
  configurée » pour les deux sections.
- **Avec dépôt de test** (dépôt mémoire derrière la même interface,
  activé par `ADF_DEPOT_MEMOIRE=1` — preuves locales uniquement,
  jamais en production) : message de test enregistré → présent dans
  la boîte admin, compteur de non-lus à 1, marquage lu effectif ;
  avis service créé → invisible sur l'accueil ; approuvé → visible
  avec la moyenne et le JSON-LD ; masqué → invisible à nouveau.
  Builds `pnpm build` verts.
