import { StorySchema } from '@/types/schema';
import { Button } from '@/components/ui/atoms/Button/Button';

export interface StoryCardProps {
  story: StorySchema;
  characterId: string;
}

export const StoryCard = ({ story, characterId }: StoryCardProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold">{story.title}</h3>
      <div className="mt-4 flex items-center gap-2">
        <Button
          href={`/stories/${characterId}/${story.id}`}
          variant="outline"
        >
          Lire l'histoire
        </Button>
      </div>
    </div>
  );
};
