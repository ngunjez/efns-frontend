'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * On-screen signature capture for the bay's signature pad or a touch screen.
 * Emits a PNG data URL. To clear it, remount it with a new `key`.
 */
export function SignaturePad({
  label,
  signerName,
  hint,
  onChange,
  className,
}: {
  label: string;
  signerName: string;
  hint: string;
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  const context = () => canvasRef.current?.getContext('2d') ?? null;

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = context();
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = getComputedStyle(canvas).color;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <span className="text-sm font-semibold">{label}</span>
      <div className="relative h-36 rounded-field border-2 border-dashed border-input bg-card sm:h-40">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={hasInk ? `${label}: signed` : `${label}: not signed yet`}
          className="absolute inset-0 size-full touch-none text-foreground"
          onPointerDown={(event) => {
            drawing.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            const { x, y } = point(event);
            context()?.beginPath();
            context()?.moveTo(x, y);
          }}
          onPointerMove={(event) => {
            if (!drawing.current) return;
            const { x, y } = point(event);
            context()?.lineTo(x, y);
            context()?.stroke();
            if (!hasInk) setHasInk(true);
          }}
          onPointerUp={() => {
            drawing.current = false;
            if (hasInk) onChange(canvasRef.current?.toDataURL('image/png') ?? null);
          }}
        />
        <span className="pointer-events-none absolute bottom-2 left-3 text-xs text-muted-foreground">
          {signerName}
        </span>
        <span className="pointer-events-none absolute right-3 bottom-2 text-xs text-muted-foreground">
          {hint}
        </span>
      </div>
    </div>
  );
}
