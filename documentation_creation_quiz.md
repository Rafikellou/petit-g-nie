# Documentation : Création de Quiz pour les Enseignants

## Aperçu

Cette documentation décrit le processus de création de quiz par les enseignants dans l'application Petit Génie. Le processus permet aux enseignants de créer des questions modèles, de générer des variations, de tester le quiz et de le publier pour leurs élèves.

## Structure de la Base de Données

Nous avons créé plusieurs tables dans Supabase pour gérer le processus de création de quiz :

### 1. `activities`

Cette table stocke les activités créées par les enseignants, y compris les quiz.

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'quiz', 'exercise', etc.
  class_level TEXT, -- CP, CE1, CE2, CM1, CM2, etc.
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- Contenu de l'activité (questions, réponses, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' -- 'draft', 'published', 'archived'
);
```

### 2. `question_modele_activite_teacher`

Cette table stocke les questions modèles créées par les enseignants.

```sql
CREATE TABLE question_modele_activite_teacher (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  content JSONB NOT NULL, -- Contient la question, options, réponse correcte et explication
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. `question_activite_teacher`

Cette table stocke les questions générées pour les quiz.

```sql
CREATE TABLE question_activite_teacher (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  master_question_id UUID REFERENCES question_modele_activite_teacher(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- Contient la question, options, réponse correcte et explication
  order_index INTEGER NOT NULL DEFAULT 0, -- Pour ordonner les questions dans un quiz
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4. `student_notifications`

Cette table stocke les notifications envoyées aux élèves.

```sql
CREATE TABLE student_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- Type de notification (ex: 'new_quiz', 'reminder', etc.)
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Composants Frontend

Nous avons créé plusieurs composants React pour gérer l'interface utilisateur du processus de création de quiz :

### 1. Page Principale (`/src/app/teacher/quiz/create/page.tsx`)

Cette page gère le flux complet de création de quiz, de la génération de la question modèle à la publication du quiz.

### 2. Interface de Chat (`/src/components/chat/ChatInterface.tsx`)

Ce composant permet à l'enseignant de communiquer avec l'IA pour générer des questions.

### 3. Animation de Génération (`/src/components/quiz/GenerationAnimation.tsx`)

Ce composant affiche une animation pendant que l'IA génère des questions.

### 4. Révision des Questions (`/src/components/quiz/QuestionReview.tsx`)

Ce composant permet à l'enseignant de réviser et de modifier les questions générées.

### 5. Éditeur de Question (`/src/components/quiz/QuestionEditor.tsx`)

Ce composant permet à l'enseignant de modifier individuellement chaque question.

### 6. Aperçu du Quiz (`/src/components/quiz/QuizPreview.tsx`)

Ce composant permet à l'enseignant de tester le quiz comme un élève le verrait.

## API Endpoints

Nous avons créé plusieurs endpoints API pour gérer les interactions avec la base de données :

### 1. API Deepseek Chat (`/src/app/api/deepseek/chat/route.ts`)

Cet endpoint gère la communication avec l'API Deepseek pour générer des questions.

### 2. API Deepseek Format (`/src/app/api/deepseek/format/route.ts`)

Cet endpoint gère le formatage des réponses de Deepseek en JSON structuré.

### 3. API Questions Modèles (`/src/app/api/teacher/master-questions/route.ts`)

Cet endpoint gère la création et la récupération des questions modèles.

### 4. API Questions de Quiz (`/src/app/api/teacher/quiz-questions/route.ts`)

Cet endpoint gère la création et la récupération des questions générées pour les quiz.

### 5. API Notifications (`/src/app/api/teacher/notifications/route.ts`)

Cet endpoint gère l'envoi et la récupération des notifications pour les élèves.

## Flux de Création de Quiz

Le processus de création de quiz se déroule en plusieurs étapes :

### Étape 1 : Création de la Question Modèle

1. L'enseignant décrit la leçon du jour dans l'interface de chat.
2. Deepseek génère une question modèle basée sur cette description.
3. L'enseignant valide la question modèle.
4. La question est enregistrée dans la table `question_modele_activite_teacher`.

### Étape 2 : Génération de Variations

1. L'enseignant clique sur "Générer 10 questions similaires".
2. Deepseek génère 10 questions similaires à la question modèle.
3. L'enseignant valide les questions générées.

### Étape 3 : Révision des Questions

1. L'enseignant peut modifier individuellement chaque question.
2. L'enseignant peut tester le quiz comme un élève le verrait.
3. L'enseignant peut publier le quiz.

### Étape 4 : Publication du Quiz

1. Le quiz est enregistré dans la table `activities`.
2. Les questions sont enregistrées dans la table `question_activite_teacher`.
3. Des notifications sont envoyées aux élèves via la table `student_notifications`.

## Fonctionnalités à Finaliser

Voici les fonctionnalités qui restent à développer ou à améliorer :

### 1. Interface Élève

- Créer une interface pour que les élèves puissent voir et répondre aux quiz.
- Afficher les notifications de nouveaux quiz sur la page d'accueil des élèves.
- Ajouter une section "activités recommandées" sur la page d'accueil des élèves.

### 2. Gestion des Quiz

- Créer une interface pour que les enseignants puissent voir, modifier et supprimer les quiz existants.
- Ajouter des statistiques sur les performances des élèves.

### 3. Améliorations de l'Interface

- Ajouter des options pour personnaliser la difficulté des questions.
- Permettre l'ajout d'images aux questions.
- Améliorer l'interface de test du quiz.

## Conseils pour le Développement Futur

1. **Cohérence des Données** : Assurez-vous que les structures de données utilisées dans le frontend correspondent aux structures stockées dans la base de données.

2. **Gestion des Erreurs** : Ajoutez une gestion robuste des erreurs pour toutes les opérations de base de données et les appels API.

3. **Tests** : Créez des tests pour vérifier que toutes les fonctionnalités fonctionnent correctement.

4. **Documentation** : Mettez à jour cette documentation à mesure que vous ajoutez de nouvelles fonctionnalités.

## Références

- [Documentation de la Base de Données](./documentation_base_de_donnees.md)
- [Documentation de la Standardisation des Niveaux de Classe](./documentation_standardisation_class_level.md)
