import type { NewsFeedResponse, NewsFilterParams, NewsItem } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getNewsFeed(
  token: string,
  params: NewsFilterParams,
  signal?: AbortSignal
): Promise<NewsFeedResponse> {
  const queryParams = new URLSearchParams();

  if (params.cursor) {
    queryParams.set('cursor', params.cursor);
  }

  if (params.limit) {
    queryParams.set('limit', params.limit.toString());
  }

  if (params.type) {
    queryParams.set('type', params.type);
  }

  if (params.priority) {
    queryParams.set('priority', params.priority);
  }

  if (params.status) {
    queryParams.set('status', params.status);
  }

  const response = await fetch(`${API_BASE_URL}/news/feed?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar noticias (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {
      // Usar mensaje por defecto si no es JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function getNewsById(
  token: string,
  id: string,
  signal?: AbortSignal
): Promise<NewsItem> {
  const response = await fetch(`${API_BASE_URL}/news/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar detalle de noticia (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {
      // Usar mensaje por defecto
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function updateNewsStatus(
  token: string,
  id: string,
  status: 'CONFIRMED' | 'DEBUNKED',
  signal?: AbortSignal
): Promise<NewsItem> {
  const response = await fetch(`${API_BASE_URL}/news/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ status }),
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al actualizar estado de noticia (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {
      // Usar mensaje por defecto
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
