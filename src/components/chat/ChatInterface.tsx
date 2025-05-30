'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import QuestionDisplay from './QuestionDisplay';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  validated?: boolean;
  formattedContent?: any; // Contenu JSON formaté après validation
}

interface ChatInterfaceProps {
  onSendMessage: (message: string, history: Message[]) => Promise<string>;
  onValidateMessage?: (message: Message) => void;
  onGenerateActivity?: () => void;
  systemPrompt?: string;
  onMessageReceived?: (message: Message) => void;
}

export default function ChatInterface({ 
  onSendMessage, 
  onValidateMessage,
  onGenerateActivity,
  systemPrompt,
  onMessageReceived
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => systemPrompt ? [
    {
      role: 'system',
      content: systemPrompt,
      timestamp: new Date()
    }
  ] : []);

  // Mettre à jour les messages quand le systemPrompt change
  useEffect(() => {
    if (systemPrompt && (!messages.length || messages[0].role !== 'system')) {
      setMessages([
        {
          role: 'system',
          content: systemPrompt,
          timestamp: new Date()
        },
        ...messages.filter(m => m.role !== 'system')
      ]);
    }
  }, [systemPrompt]);

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Ajouter le message de l'utilisateur à l'historique
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(input, updatedMessages);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      // Ajouter la réponse de l'assistant à l'historique
      setMessages(prev => [...prev, assistantMessage]);
      if (onMessageReceived) {
        onMessageReceived(assistantMessage);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
      // Retirer le dernier message en cas d'erreur
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = async (e) => {
        const audioBlob = new Blob([e.data], { type: 'audio/webm' });
        // TODO: Implement speech-to-text conversion
        // For now, we'll just show a toast
        toast.info('La conversion voix-texte sera bientôt disponible');
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Erreur lors de l\'accès au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement file upload
    // For now, we'll just show a toast
    toast.info('L\'upload de fichiers sera bientôt disponible');
  };

  const handleValidate = async (message: Message) => {
    // Afficher un toast de chargement
    const toastId = toast.loading('Formatage de la réponse en cours...');
    
    try {
      // Déterminer si la réponse devrait être un tableau ou un objet
      const isArray = message.content.includes('[') && message.content.includes(']');
      
      // Envoyer la réponse brute à l'API de formatage
      const response = await fetch('/api/deepseek/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawResponse: message.content,
          isArray
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du formatage de la réponse');
      }
      
      const data = await response.json();
      
      // Mettre à jour le message avec le contenu formaté
      const updatedMessage = { 
        ...message, 
        validated: true,
        formattedContent: data.formattedResponse 
      };
      
      setMessages(prev => 
        prev.map(m => m === message ? updatedMessage : m)
      );
      
      // Fermer le toast de chargement et afficher un toast de succès
      toast.dismiss(toastId);
      toast.success('Réponse formatée avec succès');
      
      // Appeler le callback de validation avec le message mis à jour
      if (onValidateMessage) {
        onValidateMessage(updatedMessage);
      }
    } catch (error) {
      console.error('Erreur lors du formatage:', error);
      toast.dismiss(toastId);
      toast.error(`Erreur lors du formatage: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg border border-white/10">
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : message.role === 'assistant'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-700 text-white'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="font-medium text-indigo-400 mb-1">
                  Futur Génie
                </div>
              )}
              {message.role === 'system' && (
                <div className="font-medium text-gray-400 mb-1">
                  Système
                </div>
              )}
              {message.role === 'assistant' ? (
                <>
                  <QuestionDisplay 
                    content={message.formattedContent ? JSON.stringify(message.formattedContent) : message.content} 
                    showRawContent={!message.validated}
                  />
                  
                  {!message.validated && onValidateMessage && (
                    <button
                      onClick={() => handleValidate(message)}
                      className="mt-4 flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md"
                    >
                      <Check size={16} />
                      Valider cette réponse
                    </button>
                  )}
                </>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">⋯</div>
                <div>Futur Génie est en train d'écrire...</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full hover:bg-white/5 ${
              isRecording ? 'text-red-500' : 'text-white'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <label className="p-2 rounded-full hover:bg-white/5 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Paperclip size={20} />
          </label>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        
        {onGenerateActivity && messages.some(m => m.validated) && (
          <button
            onClick={onGenerateActivity}
            className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
          >
            Générer l'activité
          </button>
        )}
      </div>
    </div>
  );
}
