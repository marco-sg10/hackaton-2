import type {
  Crew,
  WantedDetail,
  WantedFilterParams,
  WantedPageResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getWantedPosters(
  token: string,
  params: WantedFilterParams,
  signal?: AbortSignal
): Promise<WantedPageResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', params.page.toString());
  queryParams.set('size', params.size.toString());

  if (params.status) {
    queryParams.set('status', params.status);
  }
  if (params.crewId) {
    queryParams.set('crewId', params.crewId);
  }
  if (params.fruit) {
    queryParams.set('fruit', params.fruit);
  }
  if (params.q && params.q.trim()) {
    queryParams.set('q', params.q.trim());
  }
  if (params.sort) {
    queryParams.set('sort', params.sort);
  }

  const response = await fetch(`${API_BASE_URL}/wanted?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar carteles (${response.status})`;
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

export async function getWantedPosterById(
  token: string,
  id: string,
  signal?: AbortSignal
): Promise<WantedDetail> {
  const response = await fetch(`${API_BASE_URL}/wanted/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar detalle del cartel (${response.status})`;
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

export async function getCrews(token: string, signal?: AbortSignal): Promise<Crew[]> {
  const response = await fetch(`${API_BASE_URL}/crews`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let errorMsg = `Error al cargar tripulaciones (${response.status})`;
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
