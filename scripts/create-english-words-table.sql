-- Fonction pour créer la table english_words si elle n'existe pas
create or replace function create_english_words_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Vérifier si la table existe déjà
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'english_words') then
    -- Créer la table
    create table english_words (
      id uuid default gen_random_uuid() primary key,
      word text not null,
      translation text not null,
      category text not null,
      image_url text not null,
      example text not null,
      example_translation text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Créer un index pour la recherche par catégorie
    create index english_words_category_idx on english_words(category);

    -- Ajouter des commentaires pour la documentation
    comment on table english_words is 'Table contenant les mots anglais pour l''apprentissage';
    comment on column english_words.word is 'Le mot en anglais';
    comment on column english_words.translation is 'La traduction en français';
    comment on column english_words.category is 'La catégorie du mot (ex: animals, family, etc.)';
    comment on column english_words.image_url is 'L''URL de l''image illustrant le mot';
    comment on column english_words.example is 'Une phrase exemple en anglais';
    comment on column english_words.example_translation is 'La traduction de la phrase exemple';
  end if;
end;
$$;
