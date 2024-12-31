import { characters } from '@/data/characters';
import { StoryCard } from '@/components/stories/StoryLibrary';
import type { CharacterStory } from '@/types/story-types';

export default function Histoires() {
  const allStories = Object.values(characters).flatMap(character =>
    character.stories.map(story => ({
      ...story,
      character,
    }))
  );

  return (
    <main className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Bibliothèque d'Histoires
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Découvrez notre collection d'histoires interactives, conçues pour rendre l'apprentissage amusant et engageant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allStories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
