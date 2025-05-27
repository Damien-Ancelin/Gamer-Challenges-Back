# 🎮 Gamer Challenges

## 🏆 Description

Gamer Challenges est une plateforme dédiée aux joueurs souhaitant repousser leurs limites et prolonger l’expérience des jeux qu’ils aiment. Créez ou relevez des défis de tous niveaux, dans de nombreuses catégories, et explorez de nouvelles façons de jouer ! Que vous soyez passionné, avide de dépassement de soi, ou simplement curieux de découvrir de nouveaux horizons, rejoignez notre communauté et allez au-delà de ce que les jeux ont à vous offrir !

## 📦 Package

### Dépendances principales :

- 🛡️ **argon2** : Gestion des mots de passe sécurisés.
- ☁️ **cloudinary** : Gestion des médias dans le cloud.
- 🍪 **cookie-parser** : Analyse des cookies HTTP.
- 🌐 **cors** : Gestion des politiques de partage des ressources entre origines.
- 🐛 **debug** : Outil de débogage.
- 🌱 **dotenv** : Gestion des variables d'environnement.
- 🚀 **express** : Framework web rapide et minimaliste.
- 🛡️ **helmet** : Sécurisation des en-têtes HTTP.
- ✅ **joi** : Validation des schémas de données.
- 🔑 **jsonwebtoken** : Gestion des tokens JWT.
- 📜 **morgan** : Middleware de journalisation HTTP.
- 📂 **multer** : Gestion des fichiers multipart/form-data.
- 🐘 **pg** : Client PostgreSQL.
- 🔄 **redis** : Client Redis.
- 🗄️ **sequelize** : ORM pour PostgreSQL.
- 🔑 **uuid** : Génération d'identifiants uniques.

## 🚀 Installation

1. Clonez le dépôt :

   ```bash
   git clone
   ```

2. Accédez au répertoire du projet :

   ```bash
   cd Gamer-Challenges-Back
   ```

3. Créez et remplissez le fichier .env à partir du fichier `.env.example` :

   ```bash
   NODE_ENV=development
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_DB=db
   POSTGRES_PORT=5432
   POSTGRES_HOST=container-postgres
   API_PORT=3000
   FRONTEND_URL=http://url:port
   FRONTEND_PREVIEW_URL=http://url_vite_preview:port
   API_URL=http://url:port
   REDIS_PORT=6379
   REDIS_HOST=container-redis
   REDIS_URL=redis://container_redis_name:redis_port
   JWT_ACCESS_SECRET=your_jwt_access_token_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_token_secret
   JWT_ACCESS_EXPIRATION_TIME=10minutes
   JWT_REFRESH_EXPIRATION_TIME=7days
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Installez les dépendances :

   ```bash
   npm install
   ```

5. Lancez le projet :

   ```bash
   npm run docker:dev:start
   ```

6. Synchronisez la base de données :

   - **Option 1** : Créez la base de données
     ```bash
     npm run db:create:dev
     ```

   - **Option 2** : Générez les données de test
     ```bash
     npm run db:seeding:dev
     ```

   - **Option complète** : Réinitialisez la base de données
     ```bash
     npm run db:reset:dev
     ```

7. Ouvrez votre navigateur et accédez à <http://localhost:3000>.
