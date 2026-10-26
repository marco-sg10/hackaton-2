const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DashboardSummary {
  totalWanted: number;
  confirmedWanted: number;
  totalNews: number;
  confirmedNews: number;
  totalSagas: number;
}

export interface LogPoseStatus {
  hasLogPose: boolean;
  unlockedAt?: string;
}

export async function getDashboardSummary(token: string): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }

  return response.json();
}

export async function getLogPoseStatus(token: string): Promise<LogPoseStatus> {
  const response = await fetch(`${API_BASE_URL}/log-pose`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch log pose status');
  }

  return response.json();
}
