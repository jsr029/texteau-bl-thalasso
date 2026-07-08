# 1. Installation complète (copie-colle)

Bash# 1. Aller dans ton dossier de travail
cd /home/workdir

## 2. Supprimer l’ancienne version si elle existe

rm -rf texteau-new

## 3. Créer le nouveau projet

npx create-vite@latest texteau-new --template react
cd texteau-new

## 4. Installer toutes les dépendances

npm install tailwindcss@^3.4.0 postcss autoprefixer \
  react-router-dom jspdf jspdf-autotable axios \
  express mongoose bcryptjs jsonwebtoken cors dotenv nodemon concurrently

## 5. Initialiser Tailwind

npx tailwindcss init -p

## 2. Arborescence finale

``javascript

texttexteau-new/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── server.js
├── public/
│   └── logo.png
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── index.css
└── dist/ (généré après build)
``
