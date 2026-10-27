import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  currentIndex: number;
  totalStages: number;
  onNavigate: (newIndex: number) => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  currentIndex,
  totalStages,
  onNavigate,
  enabled = true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled || totalStages === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está en un input o textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < totalStages - 1) {
          onNavigate(currentIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        onNavigate(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onNavigate(totalStages - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, totalStages, onNavigate, enabled]);
}
