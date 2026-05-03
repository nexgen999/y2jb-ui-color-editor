# Y2JB UI Color Editor

Cette application est un éditeur visuel conçu pour personnaliser les couleurs et les textes de l'interface de **ps5-y2jb-autoloader**.

## 🛠 Usage

1. Personnalisez les couleurs et les chaines de caractères via la barre latérale.
2. Vous pouvez choisir entre une couleur unie ou une image (`background.jpg`) pour le fond de l'interface.
3. Cliquez sur le bouton "Exporter export.js".
4. Prenez le fichier `export.js` généré et remplacez le fichier original (généralement `main.js`) dans votre projet issu de [ps5-y2jb-autoloader](https://github.com/itsPLK/ps5-y2jb-autoloader).
5. Si vous avez choisi l'option Image, n'oubliez pas d'ajouter un fichier nommé `background.jpg` dans le même dossier que votre `main.js` sur votre hôte.

**Note :** Cette version de l'éditeur est compatible uniquement avec la **release v0.5** de l'autoloader.

## 🚀 Installation Locale

Pour lancer cette application sur votre machine :

1. Assurez-vous d'avoir **Node.js** installé.
2. Clonez ou téléchargez ce projet.
3. Ouvrez un terminal dans le dossier du projet.
4. Installez les dépendances :
   ```bash
   npm install
   ```
5. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
6. Ouvrez votre navigateur sur `http://localhost:3000`.

## 🏗️ Crédits

Basé sur le travail original de Gezine et PLK pour le projet [ps5-y2jb-autoloader](https://github.com/itsPLK/ps5-y2jb-autoloader).
