# Documentation de la Base de Données Supabase - Petit Génie

Ce document décrit les différentes tables de la base de données Supabase utilisées par l'application Petit Génie, ainsi que leurs relations et leurs fonctions.

## Tables Principales

### 1. `users` - Utilisateurs
- **Description** : Stocke les informations de base des utilisateurs.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `created_at` : Date de création
  - `email` : Adresse email (unique)
  - `role` : Rôle de l'utilisateur ('super_admin', 'admin', 'teacher', 'parent')
  - `surname` : Prénom
  - `family_name` : Nom de famille
- **Relations** :
  - Lié à `user_details` via `user_id`
  - Lié à `school_users` via `user_id`
  - Lié à `parent_children` via `parent_id` (pour les utilisateurs parents)
  - Lié à `class_teachers` via `user_id` (pour les utilisateurs enseignants)

### 2. `user_details` - Détails des Utilisateurs
- **Description** : Stocke des informations supplémentaires sur les utilisateurs.
- **Champs principaux** :
  - `user_id` : Référence à l'utilisateur
  - `pin` : Code PIN à 4 chiffres (pour les parents)
  - `surname_child` : Nom de l'enfant (pour les parents)
  - `class_level` : Niveau de classe (CP, CE1, CE2, CM1, CM2) - Champ standardisé pour tous les niveaux de classe dans l'application
  - `created_at` : Date de création
  - `updated_at` : Date de mise à jour
- **Relations** :
  - Appartient à `users` via `user_id`

### 3. `schools` - Écoles
- **Description** : Stocke les informations sur les écoles.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `name` : Nom de l'école
  - `address` : Adresse
  - `postal_code` : Code postal
  - `city` : Ville
  - `phone` : Numéro de téléphone
  - `email` : Email de contact
  - `invitation_code` : Code d'invitation unique
  - `created_at` : Date de création
  - `updated_at` : Date de mise à jour
- **Relations** :
  - Lié à `classes` via `school_id`
  - Lié à `school_users` via `school_id`

### 4. `classes` - Classes
- **Description** : Stocke les informations sur les classes.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `school_id` : Référence à l'école
  - `name` : Nom de la classe
  - `class_level` : Niveau de classe (CP, CE1, CE2, CM1, CM2)
  - `academic_year` : Année académique
  - `created_at` : Date de création
  - `updated_at` : Date de mise à jour
- **Relations** :
  - Appartient à `schools` via `school_id`
  - Lié à `children` via `class_id`
  - Lié à `class_teachers` via `class_id`

### 5. `children` - Enfants (Élèves)
- **Description** : Stocke les informations sur les enfants (élèves).
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `full_name` : Nom complet
  - `class_id` : Référence à la classe (relation avec la table `classes`)
  - `created_at` : Date de création
  - `updated_at` : Date de mise à jour
- **Note** : Les enfants peuvent être liés à une classe spécifique via `class_id` ou avoir un niveau de classe générique via `class_level` dans d'autres tables.
- **Relations** :
  - Appartient à une `classes` via `class_id`
  - Lié à `parent_children` via `child_id`

## Tables de Relations

### 6. `school_users` - Relations École-Utilisateur
- **Description** : Associe les utilisateurs (admin, enseignants) à leurs écoles.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `school_id` : Référence à l'école
  - `user_id` : Référence à l'utilisateur
  - `role` : Rôle de l'utilisateur dans l'école ('admin', 'teacher')
  - `created_at` : Date de création
- **Relations** :
  - Relie `schools` à `users`

### 7. `class_teachers` - Relations Classe-Enseignant
- **Description** : Associe les enseignants à leurs classes.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `class_id` : Référence à la classe
  - `user_id` : Référence à l'utilisateur (enseignant)
  - `created_at` : Date de création
- **Relations** :
  - Relie `classes` à `users` (enseignants)

### 8. `parent_children` - Relations Parent-Enfant
- **Description** : Associe les parents à leurs enfants.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `parent_id` : Référence à l'utilisateur parent
  - `child_id` : Référence à l'enfant
  - `created_at` : Date de création
- **Relations** :
  - Relie `users` (parents) à `children`

## Tables pour les Quiz et Questions

### 9. `questions` - Questions
- **Description** : Stocke les questions pour les quiz.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `class_level` : Niveau de classe
  - `subject` : Matière
  - `topic` : Sujet
  - `period` : Période
  - `specificity` : Spécificité
  - `type` : Type de question
  - `question` : Texte de la question
  - `options` : Options de réponse (JSON)
  - `correct_answer` : Réponse correcte
  - `created_at` : Date de création
- **Relations** :
  - Lié à `question_responses` via `question_id`

### 10. `master_questions` - Questions Maîtres
- **Description** : Stocke les questions maîtres qui peuvent être utilisées comme modèles.
- **Champs principaux** :
  - Similaires à la table `questions`

### 11. `question_responses` - Réponses aux Questions
- **Description** : Stocke les réponses des utilisateurs aux questions.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `user_id` : Référence à l'utilisateur
  - `question_id` : Référence à la question
  - `selected_answer` : Réponse sélectionnée
  - `is_correct` : Indique si la réponse est correcte
  - `timestamp` : Horodatage
- **Relations** :
  - Appartient à `users` via `user_id`
  - Appartient à `questions` via `question_id`

### 12. `quiz_progress` - Progression des Quiz
- **Description** : Suit la progression des utilisateurs dans les quiz.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `user_id` : Référence à l'utilisateur
  - `total_questions` : Nombre total de questions
  - `correct_answers` : Nombre de réponses correctes
  - `last_question_timestamp` : Horodatage de la dernière question
  - `subject` : Matière
  - `topic` : Sujet
  - `created_at` : Date de création
  - `updated_at` : Date de mise à jour
- **Relations** :
  - Appartient à `users` via `user_id`

## Tables pour les Ressources Éducatives

### 13. `audiobooks` - Livres Audio
- **Description** : Stocke les informations sur les livres audio.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `title` : Titre
  - `description` : Description
  - `audio_url` : URL du fichier audio
  - `duration` : Durée en secondes
  - `age_range` : Tranche d'âge
  - `created_at` : Date de création
- **Relations** :
  - Lié à `audiobook_progress` via `audiobook_id`

### 14. `audiobook_progress` - Progression des Livres Audio
- **Description** : Suit la progression des utilisateurs dans les livres audio.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `user_id` : Référence à l'utilisateur
  - `audiobook_id` : Référence au livre audio
  - `progress` : Progression (0-100%)
  - `last_position` : Dernière position
  - `completed` : Indique si le livre audio est terminé
  - `created_at` : Date de création
  - `updated_at` : Date de mise à jour
- **Relations** :
  - Appartient à `users` via `user_id`
  - Appartient à `audiobooks` via `audiobook_id`

### 15. `english_words` - Mots Anglais
- **Description** : Stocke les mots anglais pour l'apprentissage.
- **Champs principaux** :
  - `id` : Identifiant unique (UUID)
  - `word` : Mot en anglais
  - `translation` : Traduction en français
  - `category` : Catégorie
  - `image_url` : URL de l'image
  - `example` : Phrase exemple
  - `example_translation` : Traduction de la phrase exemple
  - `created_at` : Date de création

## Tables pour les Activités

### 16. `activities` - Activités
- **Description** : Stocke les activités éducatives.
- **Champs principaux** :
  - Informations sur les activités éducatives proposées

## Sécurité et Contrôle d'Accès

La base de données utilise les politiques de sécurité au niveau des lignes (Row Level Security - RLS) de Supabase pour contrôler l'accès aux données :

- Les super-administrateurs ont accès à toutes les données
- Les administrateurs ont accès aux données de leur école
- Les enseignants ont accès aux données de leurs classes
- Les parents ont accès aux données de leurs enfants
- Les utilisateurs ont accès à leurs propres données

## Schéma des Relations

```
users
 ├── user_details
 ├── school_users ─── schools
 │                     └── classes ─── class_teachers
 └── parent_children ─── children
 
questions
 └── question_responses

audiobooks
 └── audiobook_progress
```

## Notes Importantes

1. La migration de `class_id` vers `class_level` a été effectuée pour simplifier la structure et permettre l'utilisation directe des niveaux de classe (CP, CE1, CE2, CM1, CM2).

2. Les politiques RLS garantissent que les utilisateurs ne peuvent accéder qu'aux données auxquelles ils sont autorisés, ce qui est essentiel pour une application éducative manipulant des données d'enfants.

3. Les tables sont conçues pour permettre une évolution de l'application avec l'ajout de nouvelles fonctionnalités éducatives.
