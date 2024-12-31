'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, Keyboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Canvas } from '@/components/dictee/Canvas';
import { KeyboardInput } from '@/components/dictee/KeyboardInput';

const DicteePage: FC = () => {
  const [mode, setMode] = useState<'stylet' | 'clavier'>('stylet');

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Dictée Interactive
          </h1>
          <p className="text-white/70 text-lg">
            Choisis ton mode préféré et commence ta dictée
          </p>
        </div>

        <Tabs defaultValue="stylet" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="stylet" className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Mode Stylet
            </TabsTrigger>
            <TabsTrigger value="clavier" className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Mode Clavier
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stylet" className="mt-0">
            <div className="glass-card p-8">
              <Canvas />
            </div>
          </TabsContent>
          
          <TabsContent value="clavier" className="mt-0">
            <div className="glass-card p-8">
              <KeyboardInput />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default DicteePage;
