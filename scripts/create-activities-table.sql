-- Script pour créer la table activities

-- Fonction pour créer la table activities si elle n'existe pas
create or replace function create_activities_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Vérifier si la table existe déjà
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'activities') then
    -- Créer la table
    create table activities (
      id uuid default gen_random_uuid() primary key,
      type text not null check (type in ('quiz', 'exercise', 'game', 'story')),
      class_level text not null,
      teacher_id uuid references auth.users(id) on delete cascade,
      content jsonb not null,
      status text not null check (status in ('draft', 'published', 'archived')),
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Créer des index pour améliorer les performances
    create index activities_class_level_idx on activities(class_level);
    create index activities_teacher_id_idx on activities(teacher_id);
    create index activities_type_idx on activities(type);
    create index activities_status_idx on activities(status);

    -- Ajouter des commentaires pour la documentation
    comment on table activities is 'Table contenant les activités éducatives créées par les enseignants';
    comment on column activities.type is 'Type d''activité (quiz, exercise, game, story)';
    comment on column activities.class_level is 'Niveau de classe auquel l''activité est destinée (CP, CE1, CE2, CM1, CM2)';
    comment on column activities.teacher_id is 'ID de l''enseignant qui a créé l''activité';
    comment on column activities.content is 'Contenu de l''activité au format JSON (questions, réponses, etc.)';
    comment on column activities.status is 'Statut de l''activité (draft, published, archived)';

    -- Créer un trigger pour mettre à jour le champ updated_at
    create trigger set_updated_at
    before update on activities
    for each row
    execute function set_updated_at_timestamp();

    -- Créer des politiques RLS (Row Level Security)
    alter table activities enable row level security;

    -- Super Admin peut tout voir
    create policy "Super Admin peut voir toutes les activités"
      on activities for select
      using (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

    -- Admin peut voir les activités de son école
    create policy "Admin peut voir les activités de son école"
      on activities for select
      using (
        exists (
          select 1 from user_details
          where user_details.user_id = auth.uid()
          and user_details.role = 'admin'
          and user_details.school_id = (
            select school_id from user_details
            where user_details.user_id = activities.teacher_id
          )
        )
      );

    -- Enseignant peut voir ses propres activités
    create policy "Enseignant peut voir ses propres activités"
      on activities for select
      using (
        activities.teacher_id = auth.uid()
      );

    -- Enseignant peut créer ses propres activités
    create policy "Enseignant peut créer ses propres activités"
      on activities for insert
      with check (
        auth.uid() = teacher_id
      );

    -- Enseignant peut modifier ses propres activités
    create policy "Enseignant peut modifier ses propres activités"
      on activities for update
      using (
        activities.teacher_id = auth.uid()
      );

    -- Enseignant peut supprimer ses propres activités
    create policy "Enseignant peut supprimer ses propres activités"
      on activities for delete
      using (
        activities.teacher_id = auth.uid()
      );

    -- Parent peut voir les activités de la classe de son enfant
    create policy "Parent peut voir les activités de la classe de son enfant"
      on activities for select
      using (
        exists (
          select 1 from user_details
          where user_details.user_id = auth.uid()
          and user_details.role = 'parent'
          and user_details.class_level = activities.class_level
        )
      );
  end if;

  -- Vérifier si la fonction set_updated_at_timestamp existe
  if not exists (select from pg_proc where proname = 'set_updated_at_timestamp') then
    -- Créer la fonction pour mettre à jour le champ updated_at
    create or replace function set_updated_at_timestamp()
    returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;
  end if;
end;
$$;

-- Exécuter la fonction pour créer la table
select create_activities_table();
