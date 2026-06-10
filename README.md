# eShop.fr - Plateforme E-commerce

Une application e-commerce moderne construite avec Node.js, Express et HTML/CSS/JavaScript vanilla.

## 🚀 Fonctionnalités

- ✅ **Authentification utilisateur** - Inscription et connexion sécurisées avec JWT
- ✅ **Catalogue de produits** - Affichage dynamique des produits
- ✅ **Panier d'achat** - Ajouter, modifier, supprimer des articles
- ✅ **Interface moderne** - Design responsive et intuitif
- ✅ **Base de données** - SQLite pour la persistance des données
- ✅ **API REST** - Backend RESTful complet

## 📋 Stack Technique

### Frontend
- HTML5
- CSS3 (Responsive Design)
- JavaScript vanilla (ES6+)

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (Hachage des mots de passe)
- CORS

## 🛠️ Installation

### Prérequis
- Node.js >= 14.0
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/Cominou25/eshop.fr.git
cd eshop.fr
```

2. **Installer les dépendances backend**
```bash
cd backend
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditez `.env` et changez les valeurs (particulièrement `JWT_SECRET`):
```
PORT=5000
JWT_SECRET=votre_clé_secrète_très_sécurisée
NODE_ENV=development
DATABASE_PATH=./database.db
```

4. **Démarrer le serveur**
```bash
npm start
```

Pour le mode développement avec rechargement automatique:
```bash
npm run dev
```

5. **Accéder à l'application**
```
Frontend: http://localhost:5000
```

## 📖 Utilisation

### Endpoints API

#### Authentification
- `POST /api/auth/register` - Créer un compte
  ```json
  {
    "username": "monnom",
    "email": "email@example.com",
    "password": "motdepasse",
    "confirmPassword": "motdepasse"
  }
  ```

- `POST /api/auth/login` - Se connecter
  ```json
  {
    "email": "email@example.com",
    "password": "motdepasse"
  }
  ```

- `GET /api/auth/me` - Obtenir le profil utilisateur (Nécessite JWT Token)

- `POST /api/auth/logout` - Se déconnecter

#### Produits
- `GET /api/products` - Lister tous les produits
- `GET /api/products/:id` - Obtenir un produit spécifique
- `POST /api/products` - Créer un produit (Authentifié)

### Utilisation du Frontend

1. **S'inscrire/Se connecter** via la page Connexion
2. **Parcourir les produits** dans la section Produits
3. **Ajouter au panier** en cliquant sur les boutons
4. **Consulter le panier** et modifier les quantités
5. **Procéder au paiement** (demo)

## 🗄️ Structure Base de Données

### Table `users`
```sql
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT)
- created_at (DATETIME)
```

### Table `products`
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- price (REAL)
- image (TEXT)
- stock (INTEGER)
- created_at (DATETIME)
```

### Table `orders`
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- total (REAL)
- status (TEXT)
- created_at (DATETIME)
```

## 🔐 Sécurité

- Les mots de passe sont hachés avec bcryptjs
- Authentification par JWT tokens
- CORS configuré pour la communication frontend/backend
- Variables sensibles dans `.env` (non versionné)

## 📱 Responsive Design

L'application est entièrement responsive et fonctionne sur:
- Desktop
- Tablet
- Mobile

## 🚀 Déploiement

### Déployer sur Heroku

```bash
# Créer une nouvelle app
heroku create votre-app-name

# Ajouter les variables d'environnement
heroku config:set JWT_SECRET=votre_clé_secrète
heroku config:set NODE_ENV=production

# Déployer
git push heroku main
```

### Autres plateformes
- Railway.app
- Render.com
- DigitalOcean
- Fly.io

## 📝 Prochaines étapes

- [ ] Intégration de paiement (Stripe/PayPal)
- [ ] Système d'avis et commentaires
- [ ] Filtres et recherche avancée
- [ ] Dashboard admin
- [ ] Notifications par email
- [ ] Historique des commandes
- [ ] Wishlist/Favoris
- [ ] Tests unitaires et d'intégration

## 🤝 Contribution

Les contributions sont bienvenues! N'hésitez pas à:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout de feature'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 License

MIT - Voir le fichier LICENSE pour les détails

## 👨‍💻 Auteur

**Cominou25** - [GitHub Profile](https://github.com/Cominou25)

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur GitHub.

---

**Note**: Cette application est une démo. Pour une utilisation en production, assurez-vous d'implémenter:
- La validation des données côté serveur
- Une meilleure gestion des erreurs
- Un système de paiement réel
- Des tests de sécurité
- La conformité RGPD
