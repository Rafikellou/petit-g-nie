'use client';

import { FC, useState } from 'react';
import { Users, UserPlus, MessageSquare, Crown } from 'lucide-react';
import { StoryCollaborator } from '@/types/story';

interface CollaborativeModeProps {
  storyId: string;
  collaborators: StoryCollaborator[];
  onCollaboratorAdd: (email: string, role: StoryCollaborator['role']) => void;
}

export const CollaborativeMode: FC<CollaborativeModeProps> = ({
  storyId,
  collaborators,
  onCollaboratorAdd
}) => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<StoryCollaborator['role']>('author');

  const handleInvite = () => {
    if (inviteEmail) {
      onCollaboratorAdd(inviteEmail, selectedRole);
      setInviteEmail('');
      setShowInvite(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6" />
          Mode Collaboratif
        </h3>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="px-4 py-2 bg-purple-500 rounded flex items-center gap-2 hover:bg-purple-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Inviter
        </button>
      </div>

      {showInvite && (
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-white/70 mb-2">Email de l'ami</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="ami@example.com"
              className="w-full p-3 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-2">Rôle</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as StoryCollaborator['role'])}
              className="w-full p-3 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="author">Auteur</option>
              <option value="illustrator">Illustrateur</option>
              <option value="editor">Éditeur</option>
            </select>
          </div>

          <button
            onClick={handleInvite}
            disabled={!inviteEmail}
            className="w-full py-2 bg-purple-500 rounded font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            Envoyer l'invitation
          </button>
        </div>
      )}

      <div className="space-y-4">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {collaborator.avatar ? (
                <img
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {collaborator.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium flex items-center gap-2">
                  {collaborator.name}
                  {collaborator.contributions > 10 && (
                    <Crown className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className="text-sm text-white/70">
                  {collaborator.role === 'author' && 'Auteur'}
                  {collaborator.role === 'illustrator' && 'Illustrateur'}
                  {collaborator.role === 'editor' && 'Éditeur'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/70">
                {collaborator.contributions} contributions
              </div>
              <button className="text-purple-400 hover:text-purple-300">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
