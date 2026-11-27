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

## Catalogue intégré — Étape 3b du plan console

La section « Boutique » de la page d'accueil affiche les produits
numériques **en direct de la boutique** (adf-store.vercel.app) :
visuel, titre, accroche, prix — et chaque carte renvoie, en
nouvel onglet, vers la fiche du produit dans la boutique, où le
paiement et la livraison restent ceux, prouvés, de la boutique.
L'offre du livre **imprimé** (7 500 FCFA, WhatsApp) reste
présentée séparément, au-dessus, sans confusion avec les
produits numériques.

- **Source** : `GET {BOUTIQUE_URL}/api/catalogue-public` — flux
  en lecture seule de la boutique (produits actifs uniquement,
  aucune donnée client). Base configurable par la variable
  d'environnement `BOUTIQUE_URL`, défaut
  `https://adf-store.vercel.app`. Lecture côté serveur dans
  `lib/catalogue-boutique.ts`, rendu par `ShopSection`
  (serveur) → `ShopContent` (client, textes FR/EN).
- **Revalidation** : le flux est relu au plus tard toutes les
  60 s (cache de données du `fetch`) et la page d'accueil est
  régénérée au plus tard toutes les 300 s (`revalidate` existant
  de `app/page.tsx`). Un produit masqué ou un prix modifié dans
  l'administration de la boutique se reflète donc ici en cinq
  minutes au plus tard, **sans aucun déploiement du site**.
- **Repli** : flux injoignable, réponse invalide ou catalogue
  vide → la section retombe exactement sur son état de
  l'étape 3a (offre imprimée + boutons « Commander la version
  numérique » et « Découvrir ma boutique », en nouvel onglet).
  Jamais de section cassée ni d'erreur visible.
- **Visuels** : servis par la boutique (autre origine) et
  affichés entiers, jamais rognés, par une balise `img` simple —
  aucun domaine à autoriser dans la configuration d'images du
  site, donc aucune casse possible de ce côté-là.

## Console et notifications — Phase 4 du plan console

La console unique vit dans la boutique (adf-store.vercel.app,
`/admin`) : elle réunit les deux administrations et affiche
trois compteurs, dont deux viennent d'ici — avis services en
attente et messages non lus. Le volet boutique (console, envoi
push, PWA) est documenté dans le `docs/ARCHITECTURE.md` de la
boutique, §19.

### Le pont de compteurs — `GET /api/compteurs`

- Répond deux **nombres**, jamais de contenus :
  `{ avisEnAttente, messagesNonLus }`, lus depuis le dépôt
  avis/messages ci-dessus.
- **Authentification** : la clé d'administration partagée — la
  même valeur `ADMIN_API_KEY` que les deux administrations —
  en en-tête `x-admin-key` ou `Authorization: Bearer …`,
  comparée en temps constant (`verifyAdminKey`). Sans clé
  valide : **401**.
- **Sans base** (état actuel de production) : la route répond
  `{ nonConfigure: true }` — la console affiche alors « — »
  pour la part du site, sans erreur. Même réponse si la lecture
  de la base échoue : le pont ne casse jamais la console.

### Les déclencheurs de notification — `lib/push-boutique.ts`

Le site n'a pas d'infrastructure de notification : après
l'enregistrement **réussi** d'un message (`POST /api/contact`)
ou d'un avis service (`POST /api/avis`), le site appelle en
arrière-plan le point d'entrée de la boutique,
`POST {BOUTIQUE_URL}/api/push/notifier`, avec la clé partagée
en en-tête `x-admin-key` et la charge
`{ type: 'messages' | 'avis', titre, corps, url }` — l'URL
d'ouverture étant l'administration du site. La boutique envoie
alors la notification aux appareils abonnés du propriétaire,
selon ses préférences par type.

**Échec doux, par construction** : l'appel part via `after`
(Next.js), sa réponse n'est pas attendue, et toute erreur —
boutique injoignable, `ADMIN_API_KEY` absente — est absorbée en
silence. L'enregistrement du message ou de l'avis ne dépend
jamais de cet appel ; sans base, il n'y a rien à notifier et
rien ne part.

### Activation (rappel)

Le pont et les déclencheurs deviennent réels avec les mêmes
gestes que la Phase 2 : créer la base Neon du projet site dans
Vercel (les compteurs lisent alors de vraies données), et
s'assurer que `ADMIN_API_KEY` du site a **la même valeur** que
celle de la boutique (c'est elle qui authentifie le pont dans
les deux sens). Aucun changement de code.

### Preuves locales (27 novembre 2026, serveurs de production locaux)

- Dépôt mémoire de test (`ADF_DEPOT_MEMOIRE=1`) : un message et
  un avis semés par les routes publiques ; `/api/compteurs`
  sans clé → 401, mauvaise clé → 401, clé partagée →
  `{ avisEnAttente: 1, messagesNonLus: 1 }` exact, par les deux
  formes d'en-tête.
- Console de la boutique affichant ces compteurs en direct ;
  site éteint → la console affiche « — » pour la part du site,
  sans erreur ; site revenu → compteurs à jour.
- Message et avis créés ici → notification relayée par la
  boutique et reçue par le faux service push local (journal
  côté boutique : « Notification relayée depuis le site »).
  Build `pnpm build` vert.

