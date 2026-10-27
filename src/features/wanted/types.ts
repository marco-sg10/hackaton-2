export type WantedStatus = 'AT_LARGE' | 'CAPTURED' | 'MISSING';

export type FruitType = 'PARAMECIA' | 'ZOAN' | 'LOGIA' | 'NONE';

export type WantedSort = 'bounty,desc' | 'name,asc' | 'updatedAt,desc';

export type CrewRole =
  | 'CAPTAIN'
  | 'FIRST_MATE'
  | 'NAVIGATOR'
  | 'SNIPER'
  | 'COOK'
  | 'DOCTOR'
  | 'SHIPWRIGHT'
  | 'MUSICIAN'
  | 'ARCHAEOLOGIST'
  | 'HELMSMAN'
  | 'FIGHTER';

export interface CrewRef {
  id: string;
  name: string;
}

export interface Crew {
  id: string;
  name: string;
  shipName: string;
  jollyRogerColor: string;
  memberCount: number;
  totalBounty: number;
}

export interface DevilFruit {
  name: string;
  type: FruitType;
}

export interface WantedSummary {
  id: string;
  name: string;
  epithet: string;
  bounty: number;
  status: WantedStatus;
  crew: CrewRef;
  role: CrewRole;
  devilFruit: DevilFruit | null;
  threatLevel: number;
  lastSeenIsland: string;
  updatedAt: string;
}

export interface BountyHistoryItem {
  amount: number;
  issuedAt: string;
}

export interface WantedDetail extends WantedSummary {
  age: number;
  heightCm: number;
  bio: string;
  lastSeen: {
    island: string;
    seenAt: string;
  };
  bountyHistory: BountyHistoryItem[];
}

export interface WantedPageResponse {
  content: WantedSummary[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface WantedFilterParams {
  page: number;
  size: 10 | 20 | 50;
  status?: WantedStatus;
  crewId?: string;
  fruit?: FruitType;
  q?: string;
  sort?: WantedSort;
}
