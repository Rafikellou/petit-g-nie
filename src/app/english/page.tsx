'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowLeft, Volume2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EnglishWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  image_url: string;
  example: string;
  example_translation: string;
}

interface QuizQuestion {
  correctWord: EnglishWord;
  options: EnglishWord[];
  answered?: boolean;
  isCorrect?: boolean;
  selectedWord?: EnglishWord;
}

export default function EnglishLearning() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [words, setWords] = useState<EnglishWord[]>([]);
  
  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from('english_words')
        .select('*');
      
      if (error) {
        console.error('Error fetching words:', error);
        setError('Une erreur est survenue lors du chargement des mots');
        return;
      }

      setWords(data);
    };

    fetchWords();
  }, []);

  const currentWord = words[currentWordIndex];
  const wordsPerSession = 10;
  const progress = ((currentWordIndex + 1) % wordsPerSession) || wordsPerSession;

  const playPronunciation = async (text: string, language: 'english' | 'french' = 'english') => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to get audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (e) {
      console.error('Erreur lors de la prononciation:', e);
      setError('Une erreur est survenue lors de la prononciation');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = () => {
    if (words.length === 0) return;
    
    const questions: QuizQuestion[] = [];
    const startIndex = Math.floor(currentWordIndex / wordsPerSession) * wordsPerSession;
    
    for (let i = 0; i < wordsPerSession; i++) {
      const correctWord = words[startIndex + i];
      const otherWords = words
        .filter((_, index) => index !== startIndex + i)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      questions.push({
        correctWord,
        options: [...otherWords, correctWord].sort(() => Math.random() - 0.5),
      });
    }
    
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowQuiz(true);
    setShowFinalScore(false);
  };

  const handleQuizAnswer = (selectedWord: EnglishWord) => {
    const isCorrect = selectedWord.word === quizQuestions[currentQuestionIndex].correctWord.word;
    
    // Mettre à jour la question avec la réponse
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answered: true,
      isCorrect,
      selectedWord
    };
    setQuizQuestions(updatedQuestions);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Attendre 2 secondes avant de passer à la question suivante
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowFinalScore(true);
        if ((score + (isCorrect ? 1 : 0)) >= 7) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 2000);
  };

  const nextWord = () => {
    if (currentWordIndex >= words.length - 1) {
      setCurrentWordIndex(0);
      return;
    }

    setCurrentWordIndex((prev) => {
      const next = prev + 1;
      if (next % wordsPerSession === 0) {
        generateQuiz();
      }
      return next;
    });
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Chargement des mots...</p>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    if (showFinalScore) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-card rounded-xl shadow-lg p-6 space-y-4">
              <h1 className="text-2xl font-bold text-center mb-6">Quiz terminé !</h1>
              <div className="text-center space-y-4">
                <p className="text-4xl font-bold text-primary">
                  {score}/{wordsPerSession}
                </p>
                <p className="text-muted-foreground">
                  {score >= 7 
                    ? "Excellent travail ! Continue comme ça !" 
                    : "Continue de t'entraîner, tu vas y arriver !"}
                </p>
                <Button 
                  onClick={() => {
                    setShowQuiz(false);
                    setShowFinalScore(false);
                  }}
                  className="w-full"
                >
                  Continuer l'apprentissage
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswered = currentQuestion.answered;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Quiz!</h1>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground text-right">
                  Question {currentQuestionIndex + 1}/{wordsPerSession}
                </p>
                <p className="text-sm font-medium text-right">
                  Score: {score}/{currentQuestionIndex}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg p-6 space-y-6">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={currentQuestion.correctWord.image_url}
                  alt="Quiz image"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = isAnswered && currentQuestion.selectedWord?.word === option.word;
                  const isCorrect = option.word === currentQuestion.correctWord.word;
                  
                  let buttonStyle = "h-auto py-4 text-lg transition-all duration-200";
                  if (isAnswered) {
                    if (isCorrect) {
                      buttonStyle += " bg-green-500 hover:bg-green-500 text-white border-green-500";
                    } else if (isSelected) {
                      buttonStyle += " bg-red-500 hover:bg-red-500 text-white border-red-500";
                    }
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => !isAnswered && handleQuizAnswer(option)}
                      className={buttonStyle}
                      variant={isAnswered ? "outline" : "default"}
                      disabled={isAnswered}
                    >
                      {option.word}
                    </Button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-4 p-4 rounded-lg bg-card border">
                  <p className="text-sm">
                    {currentQuestion.isCorrect ? (
                      <>
                        <span className="font-medium text-green-500">Correct !</span>
                        <br />
                        "{currentQuestion.correctWord.word}" signifie bien "{currentQuestion.correctWord.translation}".
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-red-500">Pas tout à fait...</span>
                        <br />
                        "{currentQuestion.selectedWord?.word}" signifie "{currentQuestion.selectedWord?.translation}".
                        <br />
                        La bonne réponse était "{currentQuestion.correctWord.word}" qui signifie "{currentQuestion.correctWord.translation}".
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{progress}/{wordsPerSession}</span>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={currentWord.image_url}
              alt={currentWord.word}
              fill
              className="object-contain"
            />
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{currentWord.word}</h2>
                  <Button
                    className="flex items-center gap-2 text-sm"
                    variant="ghost"
                    onClick={() => playPronunciation(currentWord.word)}
                    disabled={isLoading}
                  >
                    <Volume2 className="h-4 w-4" />
                    Écouter en anglais
                  </Button>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <p className="text-lg">{currentWord.translation}</p>
                  <Button
                    className="flex items-center gap-2 text-sm"
                    variant="ghost"
                    onClick={() => playPronunciation(currentWord.translation, 'french')}
                    disabled={isLoading}
                  >
                    <Volume2 className="h-4 w-4" />
                    Écouter en français
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/5 space-y-3">
                <p className="text-sm font-medium text-secondary-foreground">Exemple :</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm flex-1">{currentWord.example}</p>
                    <Button
                      className="flex items-center gap-2 text-sm ml-2"
                      variant="ghost"
                      onClick={() => playPronunciation(currentWord.example)}
                      disabled={isLoading}
                    >
                      <Volume2 className="h-4 w-4" />
                      Écouter
                    </Button>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <p className="text-sm flex-1">{currentWord.example_translation}</p>
                    <Button
                      className="flex items-center gap-2 text-sm ml-2"
                      variant="ghost"
                      onClick={() => playPronunciation(currentWord.example_translation, 'french')}
                      disabled={isLoading}
                    >
                      <Volume2 className="h-4 w-4" />
                      Écouter
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={nextWord} className="w-full">
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
