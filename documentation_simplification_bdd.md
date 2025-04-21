# Documentation de la Simplification de la Base de Données - Petit Génie

## Contexte

Dans le cadre de l'amélioration de la cohérence et de la maintenance de la base de données Supabase utilisée par l'application Petit Génie, nous avons entrepris une simplification de la structure en éliminant les tables redondantes et en clarifiant les relations entre les entités.

## Actions Réalisées

### 1. Suppression de la Table `profiles`

La table `profiles` a été supprimée car elle faisait double emploi avec la table `user_details`. Cette décision a été prise après analyse du code source qui a révélé que :

- La table `user_details` était largement utilisée dans l'application (17 références directes)
- La table `profiles` n'était pas utilisée dans les requêtes à la base de données

### 2. Suppression de la Table `parent_settings`

La table `parent_settings` a également été supprimée pour les raisons suivantes :

- Aucune référence à cette table n'a été trouvée dans le code source
- Elle n'était pas mentionnée dans la documentation existante
- Elle faisait probablement double emploi avec la table `user_details` qui stocke déjà les informations spécifiques aux parents

### 3. Consolidation des Informations Utilisateur

Toutes les informations supplémentaires sur les utilisateurs sont désormais stockées exclusivement dans la table `user_details`, ce qui simplifie :
- La gestion des données utilisateur
- Les requêtes à la base de données
- La maintenance du code

## Structure Actuelle

La structure actuelle de la base de données pour les informations utilisateur est la suivante :

1. **`users`** : Table principale des utilisateurs (gérée par Supabase Auth)
   - Informations de base : id, email, rôle, nom, prénom

2. **`user_details`** : Informations supplémentaires sur les utilisateurs
   - Données spécifiques : PIN, nom de l'enfant, niveau de classe, etc.
   - Relation one-to-one avec la table `users` via `user_id`

## Avantages de cette Simplification

1. **Réduction de la complexité** : Moins de tables à gérer et à maintenir
2. **Élimination des incohérences potentielles** : Plus de risque de données contradictoires entre deux tables
3. **Simplification des requêtes** : Plus besoin de jointures complexes pour récupérer les informations utilisateur
4. **Clarification du modèle de données** : Structure plus intuitive et plus facile à comprendre

## Prochaines Étapes

Après cette simplification, nous recommandons de :

1. **Vérifier s'il existe d'autres tables potentiellement redondantes** :
   - Continuer l'analyse de la structure de la base de données pour identifier d'autres doublons éventuels

2. **Normaliser le stockage du niveau de classe** :
   - Définir `classes.class_level` comme la source de vérité
   - Utiliser `class_id` comme référence dans les autres tables au lieu de dupliquer `class_level`

3. **Mettre à jour la documentation** :
   - S'assurer que tous les documents de référence reflètent cette simplification

## Références

Pour plus d'informations sur la structure de la base de données, veuillez consulter :
- [Documentation de la Base de Données](./documentation_base_de_donnees.md)
- [Documentation de la Standardisation des Niveaux de Classe](./documentation_standardisation_class_level.md)
- [Documentation du Système d'Authentification](./documentation_authentification.md)
