import type { SagaStory, SagaSummary } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getSagas(token: string, signal?: AbortSignal): Promise<SagaSummary[]> {
  const response = await fetch(`${API_BASE_URL}/sagas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar las sagas (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {
      // Ignorar error de parsing
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function getSagaStory(
  token: string,
  sagaId: string,
  signal?: AbortSignal
): Promise<SagaStory> {
  const response = await fetch(`${API_BASE_URL}/sagas/${sagaId}/story`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar la historia de la saga (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {
      // Ignorar error de parsing
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
