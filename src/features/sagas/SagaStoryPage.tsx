import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getSagaStory } from './api';
import { GrandLineMap } from './components/GrandLineMap';
import { MetricsPanel } from './components/MetricsPanel';
import { StoryProgress } from './components/StoryProgress';
import { StageNarrativeSection } from './components/StageNarrativeSection';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import type { SagaStory } from './types';

export default function SagaStoryPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [storyData, setStoryData] = useState<SagaStory | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Cargar datos de la historia de la saga
  useEffect(() => {
    if (!token || !id) return;

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getSagaStory(token, id, controller.signal)
      .then((data) => {
        setStoryData(data);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar la historia');
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id, token, retryKey]);

  // Manejo de la etapa inicial desde la URL (ej: #slug o ?stage=slug)
  const initialScrollDone = useRef(false);
  useEffect(() => {
    if (!storyData || initialScrollDone.current) return;

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetIndex = storyData.stages.findIndex((s) => s.slug === hash);
      if (targetIndex !== -1) {
        setActiveStageIndex(targetIndex);
        setTimeout(() => {
          const el = document.getElementById(`stage-${hash}`);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
    initialScrollDone.current = true;
  }, [storyData]);

  // Función para desplazarse programáticamente a una etapa
  const scrollToStage = useCallback(
    (index: number) => {
      if (!storyData || index < 0 || index >= storyData.stages.length) return;
      setActiveStageIndex(index);
      const targetStage = storyData.stages[index];
      const el = document.getElementById(`stage-${targetStage.slug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Sincronizar URL sin forzar reload
      window.history.replaceState(null, '', `#${targetStage.slug}`);
    },
    [storyData]
  );

  // Navegación por teclado (Flechas Arriba/Abajo, J/K, Home/End)
  useKeyboardNavigation({
    currentIndex: activeStageIndex,
    totalStages: storyData?.stages.length ?? 0,
    onNavigate: scrollToStage,
    enabled: !isLoading && !error,
  });

  // IntersectionObserver para Scrollytelling nativo
  useEffect(() => {
    if (!storyData || storyData.stages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-stage-index');
            const slug = entry.target.getAttribute('data-stage-slug');
            if (indexStr !== null) {
              const newIdx = parseInt(indexStr, 10);
              setActiveStageIndex(newIdx);
              if (slug) {
                // Actualizar la URL con el slug activo
                window.history.replaceState(null, '', `#${slug}`);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.2,
      }
    );

    storyData.stages.forEach((stage) => {
      const el = document.getElementById(`stage-${stage.slug}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [storyData]);

  const handleBack = () => {
    if ('startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        navigate('/sagas');
      });
    } else {
      navigate('/sagas');
    }
  };

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center text-amber-200">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg tracking-widest uppercase">
            Descifrando Poneglyph de la Gran Saga...
          </p>
        </div>
      </div>
    );
  }

  if (error || !storyData) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-8 max-w-md text-center text-amber-100 shadow-2xl">
          <p className="text-rose-400 text-lg mb-4">{error || 'Historia no disponible'}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-xl transition-colors text-sm font-medium"
            >
              Volver a las Sagas
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeStage = storyData.stages[activeStageIndex] || storyData.stages[0];
  const activePalette = activeStage.palette || storyData.saga.palette;

  return (
    <div
      className="min-h-screen transition-colors duration-700 motion-reduce:transition-none"
      style={{
        backgroundColor: activePalette.background,
        color: activePalette.text,
      }}
    >
      {/* Barra de navegación superior fija */}
      <header
        className="sticky top-0 z-40 px-4 py-3 border-b backdrop-blur-md transition-colors duration-500 flex items-center justify-between shadow-md"
        style={{
          backgroundColor: `${activePalette.surface}ee`,
          borderColor: `${activePalette.primary}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold font-serif uppercase tracking-wider"
            style={{
              backgroundColor: `${activePalette.background}80`,
              borderColor: `${activePalette.primary}40`,
              color: activePalette.primary,
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Sagas</span>
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-black font-serif tracking-wider truncate max-w-[200px] sm:max-w-md">
              {storyData.saga.title}
            </h1>
            <p className="text-[11px] opacity-75 font-mono hidden sm:block">
              {storyData.saga.subtitle}
            </p>
          </div>
        </div>

        {/* Guía de navegación por teclado accesible */}
        <div className="flex items-center gap-2 text-[11px] font-mono opacity-80">
          <span className="hidden md:inline bg-black/30 px-2 py-0.5 rounded border border-white/10">
            Navegar: ↑/↓ o J/K
          </span>
          <span
            className="px-2.5 py-1 rounded-lg font-bold border"
            style={{
              backgroundColor: `${activePalette.primary}20`,
              borderColor: activePalette.primary,
              color: activePalette.primary,
            }}
          >
            {activeStageIndex + 1}/{storyData.stages.length}
          </span>
        </div>
      </header>

      {/* Contenedor Principal: Split Screen Scrollytelling */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA STICKY: Mapa del Grand Line, Métricas y Progreso */}
          <aside className="lg:col-span-6 sticky top-20 z-20 space-y-4">
            {/* Mapa Persistente */}
            <GrandLineMap
              mapCoordinates={storyData.map}
              stages={storyData.stages}
              activeStageIndex={activeStageIndex}
              palette={activePalette}
              onSelectStage={scrollToStage}
            />

            {/* Progreso del Recorrido */}
            <StoryProgress
              currentStage={activeStageIndex}
              totalStages={storyData.stages.length}
              palette={activePalette}
            />

            {/* Métricas Dinámicas de la Etapa */}
            <MetricsPanel
              metrics={activeStage.metrics}
              palette={activePalette}
            />
          </aside>

          {/* COLUMNA NARRATIVA: Capítulos de la Historia (Scrollable) */}
          <article className="lg:col-span-6 space-y-8">
            {/* Intro general de la saga */}
            {storyData.saga.intro && (
              <header
                className="p-6 sm:p-8 rounded-3xl border backdrop-blur-md mb-8 transition-colors duration-500"
                style={{
                  backgroundColor: `${activePalette.surface}b3`,
                  borderColor: `${activePalette.primary}30`,
                }}
              >
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest block mb-2"
                  style={{ color: activePalette.primary }}
                >
                  Prólogo del Poneglyph
                </span>
                <p className="text-sm sm:text-base leading-relaxed italic opacity-90 font-serif">
                  "{storyData.saga.intro}"
                </p>
              </header>
            )}

            {/* Etapas de la Historia */}
            {storyData.stages.map((stage, idx) => (
              <StageNarrativeSection
                key={stage.id}
                stage={stage}
                index={idx}
                isActive={idx === activeStageIndex}
                palette={activePalette}
              />
            ))}

            {/* Fin del Recorrido de la Saga */}
            <footer
              className="p-8 rounded-3xl border text-center my-16 backdrop-blur-md"
              style={{
                backgroundColor: `${activePalette.surface}e6`,
                borderColor: `${activePalette.primary}50`,
              }}
            >
              <div className="text-3xl mb-3">⚓</div>
              <h3 className="text-2xl font-black font-serif mb-2">
                Fin de la Travesía en {storyData.saga.lastIsland}
              </h3>
              <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto mb-6">
                Has completado todas las etapas de la saga {storyData.saga.title}.
              </p>
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 rounded-xl font-bold font-serif text-sm transition-all"
                style={{
                  backgroundColor: activePalette.primary,
                  color: activePalette.background,
                }}
              >
                Explorar otras Sagas
              </button>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}
