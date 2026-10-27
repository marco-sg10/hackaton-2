export interface Palette {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
}

export interface SagaSummary {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  synopsis: string;
  stageCount: number;
  totalDistanceNm: number;
  firstIsland: string;
  lastIsland: string;
  palette: Palette;
}

export type StageMetricKey =
  | 'distanceNm'
  | 'crewMorale'
  | 'bountyPool'
  | 'marineThreat';

export interface StageMetric {
  key: StageMetricKey;
  label: string;
  value: number;
  unit: string;
}

export interface IslandLocation {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface SagaStage {
  id: string;
  order: number;
  slug: string;
  title: string;
  narrative: string[];
  island: IslandLocation;
  palette: Palette;
  metrics: StageMetric[];
}

export interface SagaStorySagaMeta {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  synopsis: string;
  stageCount: number;
  totalDistanceNm: number;
  firstIsland: string;
  lastIsland: string;
  palette: Palette;
  intro: string;
}

export interface SagaStoryMapCoordinates {
  width: number;
  height: number;
}

export interface SagaStory {
  saga: SagaStorySagaMeta;
  map: SagaStoryMapCoordinates;
  stages: SagaStage[];
}
