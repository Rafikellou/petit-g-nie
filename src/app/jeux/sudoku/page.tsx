'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

type Grid = (number | null)[][];

const SudokuGame: FC = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');

  // Générer une grille valide
  const generateGrid = () => {
    const size = difficulty === 'easy' ? 4 : 6;
    const symbols = Array.from({ length: size }, (_, i) => i + 1);
    const newGrid: Grid = Array(size).fill(null).map(() => Array(size).fill(null));

    // Remplir la grille avec une solution valide
    const fillGrid = (row: number = 0, col: number = 0): boolean => {
      if (col === size) {
        row++;
        col = 0;
      }
      if (row === size) return true;

      const shuffledSymbols = [...symbols].sort(() => Math.random() - 0.5);
      
      for (const num of shuffledSymbols) {
        if (isValidPlacement(newGrid, row, col, num, size)) {
          newGrid[row][col] = num;
          if (fillGrid(row, col + 1)) return true;
          newGrid[row][col] = null;
        }
      }

      return false;
    };

    fillGrid();

    // Retirer des nombres aléatoirement
    const cellsToRemove = difficulty === 'easy' ? 6 : 12;
    let removed = 0;
    
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (newGrid[row][col] !== null) {
        newGrid[row][col] = null;
        removed++;
      }
    }

    setGrid(newGrid);
    setIsComplete(false);
    setSelectedCell(null);
  };

  // Vérifier si un placement est valide
  const isValidPlacement = (grid: Grid, row: number, col: number, num: number, size: number) => {
    // Vérifier la ligne
    for (let x = 0; x < size; x++) {
      if (x !== col && grid[row][x] === num) return false;
    }

    // Vérifier la colonne
    for (let y = 0; y < size; y++) {
      if (y !== row && grid[y][col] === num) return false;
    }

    // Vérifier le bloc
    const blockSize = difficulty === 'easy' ? 2 : 3;
    const blockRow = Math.floor(row / blockSize) * blockSize;
    const blockCol = Math.floor(col / blockSize) * blockSize;

    for (let y = blockRow; y < blockRow + blockSize; y++) {
      for (let x = blockCol; x < blockCol + blockSize; x++) {
        if (y !== row && x !== col && grid[y][x] === num) return false;
      }
    }

    return true;
  };

  // Vérifier si la grille est complète et valide
  const checkCompletion = () => {
    const size = difficulty === 'easy' ? 4 : 6;
    
    // Vérifier que toutes les cellules sont remplies
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (grid[y][x] === null) return false;
      }
    }

    // Vérifier que toutes les lignes et colonnes sont valides
    for (let i = 0; i < size; i++) {
      const row = new Set(grid[i]);
      const col = new Set(grid.map(r => r[i]));
      if (row.size !== size || col.size !== size) return false;
    }

    return true;
  };

  // Gérer l'entrée d'un nombre
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const size = difficulty === 'easy' ? 4 : 6;

    if (isValidPlacement(grid, row, col, num, size)) {
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = num;
      setGrid(newGrid);

      if (checkCompletion()) {
        setIsComplete(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  // Initialiser le jeu
  useEffect(() => {
    generateGrid();
  }, [difficulty]);

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        <Link
          href="/jeux"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux jeux
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Sudoku Junior</h1>
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setDifficulty('easy')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                difficulty === 'easy'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'text-white/70 hover:text-white'
              )}
            >
              Facile (4×4)
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                difficulty === 'medium'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'text-white/70 hover:text-white'
              )}
            >
              Moyen (6×6)
            </button>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="grid gap-4 max-w-md mx-auto">
            {/* Grille */}
            <div 
              className={cn(
                'grid gap-1 p-1 bg-white/5 rounded-xl',
                difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-6'
              )}
            >
              {grid.map((row, y) =>
                row.map((cell, x) => (
                  <button
                    key={`${y}-${x}`}
                    onClick={() => setSelectedCell([y, x])}
                    className={cn(
                      'aspect-square rounded-lg text-2xl font-bold flex items-center justify-center transition-all',
                      selectedCell?.[0] === y && selectedCell?.[1] === x
                        ? 'bg-gradient-to-r from-blue-500/30 to-indigo-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    )}
                  >
                    {cell || ''}
                  </button>
                ))
              )}
            </div>

            {/* Pavé numérique */}
            <div className={cn(
              'grid gap-2',
              difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-6'
            )}>
              {Array.from({ length: difficulty === 'easy' ? 4 : 6 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleNumberInput(i + 1)}
                  disabled={!selectedCell}
                  className={cn(
                    'p-4 rounded-lg text-xl font-bold transition-all',
                    selectedCell
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {isComplete && (
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold gradient-text mb-4">
                Félicitations ! 🎉
              </h2>
              <button
                onClick={generateGrid}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Nouvelle partie
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/70">
          <p className="mb-2">Comment jouer :</p>
          <p>1. Sélectionne une case vide</p>
          <p>2. Choisis un chiffre qui n'apparaît pas déjà dans la même ligne, colonne ou bloc</p>
          <p>3. Remplis toutes les cases pour gagner !</p>
        </div>
      </div>
    </main>
  );
};

export default SudokuGame;
