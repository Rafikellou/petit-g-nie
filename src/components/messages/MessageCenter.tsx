'use client';

import { FC, useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Message } from '@/data/notifications';
import { mockParents, mockTeachers } from '@/data/users';

interface MessageCenterProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, attachments?: any[]) => void;
}

export const MessageCenter: FC<MessageCenterProps> = ({
  messages,
  currentUserId,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);

  const getUserName = (userId: string) => {
    const parent = mockParents[userId];
    if (parent) return parent.name;
    const teacher = mockTeachers[userId];
    if (teacher) return teacher.name;
    return 'Utilisateur inconnu';
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      setSelectedAttachment(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => {
          const isOwn = message.fromUserId === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  isOwn
                    ? 'bg-blue-500 rounded-l-lg rounded-tr-lg'
                    : 'bg-white/10 rounded-r-lg rounded-tl-lg'
                } p-4`}
              >
                <div className="text-sm text-white/70 mb-1">
                  {getUserName(message.fromUserId)}
                </div>
                <div className="mb-2">{message.content}</div>
                {message.attachments?.map((attachment, index) => (
                  <div
                    key={index}
                    className="mt-2 p-2 bg-white/10 rounded text-sm"
                  >
                    {attachment.type === 'progress' && (
                      <div>
                        <div className="font-medium mb-1">Progrès de la semaine</div>
                        <div>Histoires terminées : {attachment.data.weeklyProgress.storiesCompleted}</div>
                        <div>Score moyen : {attachment.data.weeklyProgress.averageQuizScore}%</div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="text-xs text-white/50 mt-1">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="w-full p-3 bg-white/5 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
              rows={3}
            />
            {selectedAttachment && (
              <div className="mt-2 p-2 bg-white/5 rounded text-sm">
                {selectedAttachment.name}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Paperclip className="w-5 h-5" />
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedAttachment(file);
                }}
              />
            </button>
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
