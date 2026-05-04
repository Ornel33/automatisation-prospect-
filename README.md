# Prospect Flow - Suite Agence E-commerce

Prospect Flow est une plateforme SaaS de prospection intelligente conçue pour une agence E-commerce spécialisée dans la mode, le fooding, la beauté, la santé, l'énergie et les projets innovants. L'outil permet de centraliser la recherche de leads, l'automatisation de l'enrichissement des données et la prise de contact ciblée.

## 🔗 Liens Utiles
- **Démo en direct :** [https://automatisation-prospects.vercel.app](https://automatisation-prospects.vercel.app)
- **Maquette UI / Design :** [Stitch Mockup](https://stitch.withgoogle.com/projects/16139420339979512322)


## 🌟 Fonctionnalités Principales

*   **Tableau de Bord (Dashboard) :** Vue d'ensemble des performances de prospection, avec statistiques sur les leads ajoutés et filtres de temps (7 jours, 30 jours, personnalisés).
*   **Recherche de Prospects Automatisée :** 
    *   Formulaire détaillé permettant de cibler les prospects par secteur d'activité, positionnement, taille d'entreprise, revenu annuel et localisation.
    *   **Intégration n8n :** Une fois le formulaire validé, un webhook n8n est déclenché en arrière-plan pour exécuter des workflows d'automatisation (Scraping via Apify, Enrichissement IA avec OpenAI/Claude).
*   **Gestion des Leads :**
    *   Liste complète des prospects avec des options de filtrage par secteur, lieu et date d'ajout.
    *   Détails complets de chaque prospect incluant la description, le téléphone, le site web et le secteur.
*   **Prise de Contact Intégrée :**
    *   Bouton d'envoi d'e-mail "One-Click" générant automatiquement un template de mail pré-rempli.
    *   Le template met en avant les services de l'agence (UX/UI, Shopify, CRO, Paid Media) et propose de planifier un rendez-vous (créneaux horaires suggérés par IA).
*   **Design Moderne & Responsive :**
    *   Interface utilisateur premium et réactive (Tailwind CSS) avec un mode "Mobile-First" (barre de navigation inférieure sur mobile, grilles fluides).
    *   Animations subtiles et feedbacks utilisateur (Toast notifications).

## 🛠️ Stack Technique

*   **Frontend :** React.js (Vite), React Router DOM
*   **Styling :** Tailwind CSS
*   **Base de Données & Backend :** Supabase (PostgreSQL)
*   **Automatisation & IA :** n8n (Workflows, Webhooks, RAG, OpenAI, Claude)
*   **Déploiement :** Vercel

## 🚀 Installation & Lancement en local

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/Ornel33/automatisation-prospect-.git
    cd automatisation-prospect-
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement :**
    Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés Supabase :
    ```env
    VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
    ```

4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:5173`.

## ⚙️ Configuration n8n

Pour que la recherche de prospects fonctionne :
1.  Assurez-vous que votre instance n8n est en ligne et que votre workflow "Recherche Prospects" est en mode **Published** (Actif).
2.  L'URL du Webhook de production n8n est configurée dans `src/pages/ProspectSearch.jsx`.

## 📦 Déploiement

Le projet est pré-configuré pour un déploiement fluide sur Vercel :
```bash
npm install -g vercel
vercel --prod
```
Assurez-vous d'ajouter vos variables d'environnement Supabase dans les paramètres de votre projet Vercel avant le déploiement.
