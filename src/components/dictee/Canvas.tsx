'use client';

import { FC, useRef, useState, useEffect } from 'react';

export const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Configuration du canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      if (ctx) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (context) {
      context.beginPath();
      if ('touches' in e) {
        const touch = e.touches[0];
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          context.moveTo(
            touch.clientX - rect.left,
            touch.clientY - rect.top
          );
        }
      } else {
        context.moveTo(
          e.nativeEvent.offsetX,
          e.nativeEvent.offsetY
        );
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        context.lineTo(
          touch.clientX - rect.left,
          touch.clientY - rect.top
        );
      }
    } else {
      context.lineTo(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
    }
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-white/5 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] border-2 border-white/10 rounded-lg touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          Effacer
        </button>
      </div>
    </div>
  );
};
