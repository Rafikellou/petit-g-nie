# Documentation de la Standardisation des Niveaux de Classe - Petit Génie

## Contexte

Dans le cadre de l'amélioration de la cohérence de la base de données et du code, nous avons standardisé les noms de champs liés aux niveaux de classe dans l'application Petit Génie. Cette standardisation vise à éliminer les incohérences terminologiques et à faciliter la maintenance du code.

## Problème Initial

Avant la standardisation, plusieurs noms de champs différents étaient utilisés pour représenter le même concept de niveau de classe :

- `class_level` dans la table `classes`
- `class-level` (avec tiret) dans la table `user_details`

**Note** : La table `profiles` a été supprimée car elle faisait double emploi avec la table `user_details`.

Cette incohérence rendait le code plus difficile à maintenir et pouvait potentiellement conduire à des erreurs lors des requêtes à la base de données ou des migrations.

## Solution Adoptée

Nous avons standardisé tous les noms de champs liés aux niveaux de classe en utilisant systématiquement `class_level` (avec underscore) dans toutes les tables concernées.

### Modifications Effectuées

1. **Base de Données** :
   - Renommage de `class-level` en `class_level` dans la table `user_details`
   - Suppression de la table `profiles` qui faisait double emploi avec `user_details`

2. **Code** :
   - Mise à jour de la documentation pour refléter cette standardisation
   - Vérification que toutes les requêtes à la base de données utilisent le nom de champ standardisé

## Convention à Suivre

Pour maintenir la cohérence, veuillez suivre ces conventions :

1. **Utiliser `class_level` pour tous les champs liés au niveau de classe** dans toutes les tables et tous les modèles de données.

2. **Format des valeurs** : Les valeurs standard pour `class_level` sont "CP", "CE1", "CE2", "CM1", "CM2".

3. **Dans le code TypeScript/JavaScript** :
   ```typescript
   // Exemple d'utilisation correcte
   const classLevel = userData.class_level;
   
   // Pour les nouveaux enregistrements
   await supabase
     .from('user_details')
     .insert({
       user_id: userId,
       class_level: selectedClass,
       // autres champs...
     });
   ```

## Stratégie à Long Terme

À l'avenir, nous envisageons de faire évoluer la gestion des niveaux de classe en :

1. **Utilisant des références `class_id`** plutôt que des valeurs directes `class_level` lorsque c'est possible, pour établir des relations plus robustes entre les tables.

2. **Consolidant les informations de classe** dans la table `classes` et en y faisant référence depuis les autres tables.

## Impacts sur les Fonctionnalités Existantes

La standardisation des noms de champs n'a pas d'impact sur les fonctionnalités existantes, car le code utilisait déjà principalement `class_level`. Les modifications apportées à la base de données ont été effectuées de manière à maintenir la compatibilité avec le code existant.

## Références

Pour plus d'informations sur la structure de la base de données, veuillez consulter :
- [Documentation de la Base de Données](./documentation_base_de_donnees.md)
- [Documentation du Système d'Authentification](./documentation_authentification.md)
